import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISMTPConfig } from 'src/common';
import Email from 'email-templates';
import { SMTPUtils } from './utils';
import { EmailTemplateRenderService } from './email-template-render.service';
import { IBasePerTenantAndOrganizationEntityModel, IVerifySMTPTransport } from 'src/contracts';

@Injectable()
export class EmailSendService {
    constructor(private readonly emailTemplateRenderService: EmailTemplateRenderService) {}

    /**
     * Retrieves an instance of the `Email` class by verifying the default SMTP transporter.
     *
     * - Fetches the default SMTP configuration.
     * - Converts the SMTP configuration to a transporter.
     * - Verifies the transporter.
     * - Returns an email instance if the transporter is valid.
     * - Throws an error if the verification fails.
     */
    public async getInstance(): Promise<Email<any> | void> {
        try {
            // Fetch the default SMTP configuration
            const smtpConfig: ISMTPConfig = SMTPUtils.defaultSMTPTransporter();

            // Convert SMTP configuration to a transport object
            const transport: IVerifySMTPTransport = SMTPUtils.convertSmtpToTransporter(smtpConfig);

            // Verify the SMTP transporter
            if (!!(await SMTPUtils.verifyTransporter(transport))) {
                return this.getEmailConfig(smtpConfig);
            }
        } catch (error) {
            console.log('Error while retrieving default global smtp configuration: %s', error?.message);
            throw new InternalServerErrorException(error);
        }
    }

    public async getEmailInstance({}: IBasePerTenantAndOrganizationEntityModel) {
        //

        const smtpConfig: ISMTPConfig = SMTPUtils.defaultSMTPTransporter();
        const transport: IVerifySMTPTransport = SMTPUtils.convertSmtpToTransporter(smtpConfig);

        if (!!(await SMTPUtils.verifyTransporter(transport))) {
            return this.getEmailConfig(smtpConfig);
        } else {
            console.log('Error while retrieving tenant/organization smtp configuration');
            throw new InternalServerErrorException('Error while retrieving tenant/organization stmp configuration');
        }
    }

    private getEmailConfig(smtpConfig: ISMTPConfig): Email<any> {
        const transport = SMTPUtils.buildTransportFromSMTPConfig(smtpConfig);

        const config: Email.EmailConfig<any> = {
            message: {
                from: smtpConfig.fromAddress || 'noreply@crm.com',
            },
            // if you want to send email in development or test environments, set options.send to true
            // send: true,
            transport: transport,
            i18n: {},
            views: {
                options: {
                    extension: 'hbs',
                },
            },
            render: this.emailTemplateRenderService.render,
        };

        return new Email(config);
    }
}
