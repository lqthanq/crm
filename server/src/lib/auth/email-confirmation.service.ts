import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import moment from 'moment';
import bcrypt from 'bcrypt';

import {
    EFeatures,
    IBasePerTenantEntityModel,
    IUser,
    IUserCodeInput,
    IUserEmailInput,
    IUserTokenInput,
    IVerificationTokenPayload,
} from 'src/contracts';
import { IAppIntegrationConfig } from 'src/common';
import { environment as env, environment } from 'src/config';

import { EmailService } from '../email-send/email.service';
import { deepMerge, generateAlphaNumericCode } from 'src/utils';
import { UserService } from '../user/user.service';
import { FeatureService } from '../feature/feature.service';
import { IsNull, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly featureFlagService: FeatureService,
    ) {}

    /**
     * Sends an email verification link and code to the user.
     */
    public async sendEmailVerification(user: IUser, integration: IAppIntegrationConfig) {
        //

        try {
            const { id, email } = user;
            const payload: IVerificationTokenPayload = { id: id!, email: email! };

            const token = sign(payload, env.JWT_VERIFICATION_TOKEN_SECRET!, {
                expiresIn: `${env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME!}s`,
            });

            const appIntegration = deepMerge(env.appIntegrationConfig, integration);

            const verificationLink = `${appIntegration.appEmailConfirmationUrl}?email=${email}&token=${token}`;
            const verificationCode = generateAlphaNumericCode();

            // Update user's email token field and verification code
            await this.userService.update(id!, {
                emailToken: await bcrypt.hash(token, 10),
                code: verificationCode,
                ...(env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME
                    ? {
                          codeExpireAt: moment(new Date())
                              .add(env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME, 'seconds')
                              .toDate(),
                      }
                    : {}),
            });

            // Send email verification link
            return await this.emailService.emailVerification(user, verificationLink, verificationCode, appIntegration);
        } catch (error) {
            console.log(error, 'Error while sending verfication email');
        }
    }

    public async decodeConfirmationToken(token: IUserTokenInput['token']): Promise<IUser | void> {
        if (!(await this.featureFlagService.isFeatureEnabled(EFeatures.FEATURE_EMAIL_VERIFICATION))) {
            return;
        }

        try {
            const payload = verify(token, environment.JWT_VERIFICATION_TOKEN_SECRET!);

            if (typeof payload === 'object' && 'email' in payload && 'id' in payload) {
                const { id, email } = payload;
                const user = await this.userService.findOneByOptions({
                    where: { id, email },
                });

                if (!!user?.emailVerifiedAt) {
                    throw new BadRequestException('Your email is already verified.');
                }

                if (!!user?.emailToken && !!(await bcrypt.compare(token, user.emailToken))) {
                    return user;
                }
            }

            throw new BadRequestException('Failed to verify email.');
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException('JWT token has been expired.');
            }

            throw new BadRequestException(error?.message);
        }
    }

    /**
     * Confirm user email
     *
     * @param user
     * @returns
     */
    public async confirmEmail(user: IUser) {
        if (!(await this.featureFlagService.isFeatureEnabled(EFeatures.FEATURE_EMAIL_VERIFICATION))) {
            return;
        }

        try {
            await this.userService.markEmailAsVerified(user['id']!);
        } finally {
            return new Object({
                status: HttpStatus.OK,
                message: 'OK',
            });
        }
    }

    public async confirmationByCode(
        payload: IUserEmailInput & IUserCodeInput & IBasePerTenantEntityModel,
    ): Promise<IUser | void> {
        if (!(await this.featureFlagService.isFeatureEnabled(EFeatures.FEATURE_EMAIL_VERIFICATION))) {
            return;
        }

        try {
            const { email, code, tenantId } = payload;

            if (email && code) {
                const user = await this.userService.findOneByOptions({
                    where: [
                        {
                            email,
                            code,
                            tenantId,
                            codeExpireAt: MoreThanOrEqual(new Date()),
                        },
                        { email, code, tenantId, codeExpireAt: IsNull() },
                    ],
                });

                if (!!user?.emailVerifiedAt) {
                    throw new BadRequestException('Your email is already verified.');
                }

                return user as IUser;
            }
        } catch (error) {
            throw new BadRequestException('Your email is already verified.');
        }
    }
}
