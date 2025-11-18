import { Injectable } from '@nestjs/common';
import { IAppIntegrationConfig } from 'src/common';
import { EEmailTemplate, IUser, ELanguages } from 'src/contracts';
import { environment as env } from 'src/config';
import { EmailSendService } from './email-send.service';
import { deepMerge } from 'src/utils';
import { IsNull } from 'typeorm';

@Injectable()
export class EmailService {
    constructor(readonly emailSendService: EmailSendService) {}

    /**
     * Send confirmation email link
     */
    async emailVerification(
        user: IUser,
        verificationLink: string,
        verificationCode: string,
        integration: IAppIntegrationConfig,
    ) {
        const { email, firstName, lastName, preferredLanguage } = user;
        const name = [firstName, lastName].filter(Boolean).join(' ') || email;

        const sendOptions = {
            template: EEmailTemplate.EMAIL_VERIFICATION,
            message: {
                to: `${email}`,
            },
            locals: {
                name,
                email,
                verificationLink,
                verificationCode,
                ...integration,
                locale: preferredLanguage,
                host: env.clientBaseUrl,
            },
        };

        const body = {
            templateName: sendOptions.template,
            email: sendOptions.message.to,
            languageCode: sendOptions.locals.locale,
            message: '',
        };

        try {
            const instance = await this.emailSendService.getInstance();

            if (instance) {
                const send = await instance.send(sendOptions);
                body['message'] = send.originalMessage;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async welcomeUser(
        user: IUser,
        languageCode: ELanguages,
        organizationId?: string,
        originUrl?: string,
        integration?: IAppIntegrationConfig,
    ) {
        //

        // Override the default config by merging in the provided values.
        const appIntegration = deepMerge(env.appIntegrationConfig, integration);

        const sendOptions = {
            template: EEmailTemplate.WELCOME_USER,
            message: {
                to: `${user.email}`,
            },
            locals: {
                locale: languageCode,
                email: user.email,
                host: originUrl || env.clientBaseUrl,
                organizationId: organizationId || IsNull(),
                // tenantId,
                ...appIntegration,
            },
        };

        try {
            const body = {
                templateName: sendOptions.template,
                email: sendOptions.message.to,
                languageCode,
                message: '',
            };

            const instance = await this.emailSendService.getEmailInstance({
                organizationId: organizationId,
                tenantId: undefined,
            });
            const send = await instance.send(sendOptions);

            body['message'] = send.originalMessage;
        } catch (error) {
            console.log('Error while sending welcome user', error);
        }
    }

    /**
     * Sends a magic login code the user's email for password-less authentication.
     *
     */
    async sendMagicLoginCode({
        email,
        magicCode,
        magicLink,
        locale,
        integration,
    }: {
        email: IUser['email'];
        magicCode: IUser['code'];
        magicLink: IAppIntegrationConfig['appMagicSignUrl'];
        locale: ELanguages;
        integration: IAppIntegrationConfig;
    }): Promise<void> {
        const sendOptions = {
            template: EEmailTemplate.PASSWORD_LESS_AUTHENTICATION,
            message: {
                to: `${email}`,
            },
            locals: {
                locale,
                email,
                magicCode,
                magicLink,
                ...integration,
            },
        };

        const body = {
            templateName: sendOptions.template,
            email: sendOptions.message.to,
            languageCode: locale,
            message: '',
        };

        try {
            // Get the email send service instance
            const instance = await this.emailSendService.getInstance();

            if (instance) {
                // Send the email
                const send = await instance.send(sendOptions);

                // Update the body with the original message
                body['message'] = send.originalMessage;
            }
        } catch (error) {
            console.log('Error while sending password-less authentication code: %s', error);
        }
    }
}
