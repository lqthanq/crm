import { Injectable } from '@nestjs/common';
import { IAppIntegrationConfig } from 'src/common';
import { EmailTemplateEnum, IUser, ELanguages } from 'src/contracts';
import { environment as env } from 'src/config';
import { EmailSendService } from './email-send.service';
import { deepMerge } from 'src/utils';
import { EmailTemplate } from '../email-template/email-template.entity';
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
        const { email, first_name, last_name, preferred_language } = user;
        const name = [first_name, last_name].filter(Boolean).join(' ') || email;

        const sendOptions = {
            template: EmailTemplateEnum.EMAIL_VERIFICATION,
            message: {
                to: `${email}`,
            },
            locals: {
                name,
                email,
                verificationLink,
                verificationCode,
                ...integration,
                locale: preferred_language,
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
            template: EmailTemplateEnum.WELCOME_USER,
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
                organization_id: organizationId,
                tenant_id: undefined,
            });
            const send = await instance.send(sendOptions);

            body['message'] = send.originalMessage;
        } catch (error) {
            console.log('Error while sending welcome user', error);
        }
    }
}
