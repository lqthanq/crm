import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { pick } from 'underscore';
import * as bcrypt from 'bcrypt';
import { JwtPayload, sign } from 'jsonwebtoken';

import { SocialAuthService } from 'src/auth';
import { UserRepository } from '../user/user.repository';
import { IUserRegistrationInput, ELanguages, IUserLoginInput, IAuthResponse, IUser, IEmployee } from 'src/contracts';
import { IAppIntegrationConfig } from 'src/common';
import { User } from '../user/user.entity';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailService } from '../email-send/email.service';
import { RequestContext } from '../core/context';
import { AccountRegistrationEvent } from '../event-bus/events';
import { EventBus } from '../event-bus/event-bus';
import { UserService } from '../user/user.service';
import { IsNull, Not } from 'typeorm';
import { environment } from 'src/config';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class AuthService extends SocialAuthService {
    constructor(
        private readonly eventBus: EventBus,
        private readonly userRepository: UserRepository,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly emailService: EmailService,
        private readonly userService: UserService,
        private readonly employeeService: EmployeeService,
    ) {
        super();
    }

    async register(input: IUserRegistrationInput & Partial<IAppIntegrationConfig>, languageCode: ELanguages) {
        let tenant = input.user.tenant;

        // 2. Register new user
        const entity = this.userRepository.create({
            ...input.user,
            tenant,
            ...(input.password ? { hash: await this.getPasswordHash(input.password) } : {}),
        });

        let user = await this.userRepository.save(entity);

        // 3. Create employee for specific user

        // 4. Email is automatically verified after accepting an invitation

        // 5. Find the latest registered user with role
        user = (await this.userRepository.findOne({
            where: { id: user.id },
            relations: { role: true },
        })) as User;

        // 6. If organizationId is provided, add the user to the organization

        // 7. Create Import Records while migrating for a relative user

        // Extract integration information
        let integration = pick(input, ['appName', 'appEmailConfirmationUrl']);

        // 8. If the user's email is not verified, send an email verification
        if (!user.emailVerifiedAt) {
            this.emailConfirmationService.sendEmailVerification(user, integration);
        }

        // Publish the account registration event
        const ctx = RequestContext.currentRequestContext();
        const event = new AccountRegistrationEvent(ctx, user);
        this.eventBus.publish(event);

        // 9. Send a welcome email to the user
        this.emailService.welcomeUser(input.user, languageCode, undefined, undefined, integration);
        return user;
    }

    /**
     * User Login Request
     */
    async login({ email, password }: IUserLoginInput): Promise<IAuthResponse | null> {
        try {
            // find ALL users by email
            const users = await this.userService.find({
                where: { email, isActive: true, isArchived: false, hash: Not(IsNull()) },
                relations: { role: true },
                order: { updatedAt: 'DESC' }, // Order by update time, latest first
            });

            // If no users are found, throw an error
            if (!users || users.length === 0) {
                throw new UnauthorizedException();
            }

            // Validate each user individually to avoid cascade failures
            const userValidations: { user: User; employee: IEmployee }[] = [];

            for (const user of users) {
                // Check password (let real bcrypt errors bubble up)
                let isPasswordValid = false;
                try {
                    isPasswordValid = await bcrypt.compare(password, user.hash!);
                } catch (bcryptError) {
                    console.error(`Password comparison failed for user ${user.id}: ${bcryptError.message}`);
                    continue;
                }

                if (!isPasswordValid) {
                    continue;
                }

                // Fetch employee record
                let employee: IEmployee | null = null;
                let isEmployeeValid = true;

                try {
                    employee = await this.employeeService.findOneByUserId(user.id!);

                    console.log('employee >>', employee);
                    if (employee) {
                        isEmployeeValid = !!employee.isActive && !employee.isArchived;
                    }
                } catch (employeeError) {
                    if (employeeError instanceof NotFoundException) {
                        employee = null;
                        isEmployeeValid = true;
                    } else {
                        throw employeeError;
                    }
                }

                // Only add to validations if both password and employee status is valid
                if (isEmployeeValid) {
                    userValidations.push({ user, employee: employee! });
                }
            }

            console.log('userValidations >>', userValidations);

            // If no valid users are found after validation, throw an error
            if (userValidations.length === 0) {
                throw new UnauthorizedException();
            }

            // Select the most recently updated user (already sorted by updatedAt DESC)
            const { user: selectedUser, employee } = userValidations[0];

            // Generate both access and refresh tokens concurrently
            const [access_token, refresh_token] = await Promise.all([
                this.getJwtAccessToken(selectedUser),
                this.getJwtRefreshToken(selectedUser),
            ]);

            // Update user's refresh token and last login timestamp concurrently
            await Promise.all([
                this.userService.setCurrentRefreshToken(refresh_token!, selectedUser.id!),
                this.userService.setUserLastLoginTimestamp(selectedUser.id!),
            ]);

            return {
                user: new User({
                    ...selectedUser,
                    ...(employee && { employee }),
                }),
                token: access_token,
                refresh_token: refresh_token,
            };
        } catch (error) {
            console.error(`Login failed at ${new Date().toISOString()}: ${error.message}.`);
            throw new UnauthorizedException();
        }
    }

    /**
     * Generates a JWT access token for a given user.
     */
    public async getJwtAccessToken(request: Partial<IUser>) {
        const tenantId = request.tenantId || RequestContext.currentTenantId();
        try {
            // Validate that the request contains a user ID
            if (!request.id) {
                throw new Error('User ID is missing in the request.');
            }

            const userId = request.id;

            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                    tenantId: tenantId!,
                    isActive: true,
                    isArchived: false,
                },
                relations: { role: { rolePermissions: true } },
                order: { createdAt: 'DESC' },
            });

            // Throw an error if the user is not found
            if (!user) {
                console.error(`User not found: ${request.id}`);
                throw new UnauthorizedException();
            }

            // Retrieve the employee details associated with the user.
            const employee = await this.employeeService.findOneByUserId(user.id!);

            // Create a payload for the JWT token
            const payload: JwtPayload = {
                id: user.id,
                tenantId: user.tenantId ?? null,
                employeeId: employee ? employee.id : null,
                role: user.role ? user.role.name : null,
                permissions: user.role?.rolePermissions?.filter((rp) => rp.enabled).map((rp) => rp.permission) ?? null,
            };

            // Generate the JWT access token using the payload
            return sign(payload, environment.JWT_SECRET!, {
                expiresIn: `${environment.JWT_TOKEN_EXPIRATION_TIME!}s`,
            });
        } catch (error) {
            console.log('Error while generating JWT access token:', error);
            throw new UnauthorizedException();
        }
    }

    /**
     * Generates a JWT refresh token for a given user.
     */
    public async getJwtRefreshToken(user: Partial<IUser>) {
        try {
            // Ensure the user object contains the necessary information
            if (!user.id || !user.email) {
                throw new Error('User ID or email is missing.');
            }

            // Contruct the JWT payload
            const payload: JwtPayload = {
                id: user.id,
                email: user.email,
                tenantId: user.tenantId || null,
                role: user.role ? user.role.name : null,
            };

            // Generate the JWT refresh token
            return sign(payload, environment.JWT_REFRESH_TOKEN_SECRET!, {
                expiresIn: `${environment.JWT_REFRESH_TOKEN_EXPIRATION_TIME!}s`,
            });
        } catch (error) {
            console.log('Error while generating JWT refresh token:', error);
        }
    }

    async getAuthenticatedUser(id: string): Promise<User | null> {
        return this.userService.getIfExists(id);
    }

    /**
     * Get JWT access token from JWT refresh token
     * @returns 
     */
    async getAccessTokenFromRefreshToken(): Promise<{ token: string } | null> {
        try {
            // Get the current user from the request context
            const user = RequestContext.currentUser();

            // If no user is found, return null
            if (!user) return null;

            // Get and return the JWT access token for the user
            const token = await this.getJwtAccessToken(user);
            return { token };
        } catch (error) {
            console.error('Error while retrieving JWT access token from refresh token:', error);
            return null;
        }
    }
}
