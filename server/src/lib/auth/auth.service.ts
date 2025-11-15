import { Injectable, UnauthorizedException } from '@nestjs/common';
import { pick } from 'underscore';
import * as bcrypt from 'bcrypt';
import { JwtPayload, sign } from 'jsonwebtoken';

import { SocialAuthService } from 'src/auth';
import { UserRepository } from '../user/user.repository';
import { IUserRegistrationInput, ELanguages, IUserLoginInput, IAuthResponse, IUser } from 'src/contracts';
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

@Injectable()
export class AuthService extends SocialAuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly emailService: EmailService,
        private readonly eventBus: EventBus,
        private readonly userService: UserService,
    ) {
        super();
    }

    async register(input: IUserRegistrationInput & Partial<IAppIntegrationConfig>, languageCode: ELanguages) {
        
        // 2. Register new user
        const entity = this.userRepository.create({
            ...input.user,
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
                // relations: { role: true },
                order: { updatedAt: 'DESC' }, // Order by update time, latest first
            });

            // If no users are found, throw an error
            if (!users || users.length === 0) {
                throw new UnauthorizedException();
            }

            // Validate each user individually to avoid cascade failures
            const userValidations: { user: User }[] = [];

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

                // TODO:
                // Fetch employee record

                userValidations.push({ user });
            }

            // If no valid users are found after validation, throw an error
            if (userValidations.length === 0) {
                throw new UnauthorizedException();
            }

            // Select the most recently updated user (already sorted by updatedAt DESC)
            const { user: selectedUser } = userValidations[0];

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
                    // TODO:
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
            if (request.id) {
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
                // relations

                order: { createdAt: 'DESC' },
            });

            // Throw an error if the user is not found
            if (!user) {
                console.error(`User not found: ${request.id}`);
                throw new UnauthorizedException();
            }

            // Retrieve the employee details associated with the user.

            // Create a payload for the JWT token
            const payload: JwtPayload = {
                id: user.id,
                tenantId: user.tenantId ?? null,
                employeeId: null, //
                role: null, //
                permissions: null, //
            };

            // Generate the JWT access token using the payload
            return sign(payload, environment.JWT_SECRET!, {});
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
                role: null, //
            };

            // Generate the JWT refresh token
            return sign(payload, environment.JWT_REFRESH_TOKEN_SECRET!, {
                expiresIn: `${environment.JWT_REFRESH_TOKEN_EXPIRATION_TIME!}s`,
            });
        } catch (error) {
            console.log('Error while generating JWT refresh token:', error);
        }
    }
}
