import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import moment from 'moment';
import bcrypt from 'bcrypt';

import { IUser, IVerificationTokenPayload } from 'src/contracts';
import { IAppIntegrationConfig } from 'src/common';
import { environment as env } from 'src/config';

import { EmailService } from '../email-send/email.service';
import { deepMerge, generateAlphaNumericCode } from 'src/utils';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailConfirmationService {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
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
}
