import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailTemplateRepository } from '../email-template/email-template.repository';
import { IEmailTemplate, ELanguages } from 'src/contracts';
import { IsNull } from 'typeorm';
import Handlebars from 'handlebars';

@Injectable()
export class EmailTemplateRenderService {
    constructor(private emailTemplateRepository: EmailTemplateRepository) {}

    /** Renders an email template based on the provided view and locals */
    public render = async (view: string, locals: any) => {
        try {
            view = view.replace('\\', '/');

            const query = new Object({
                name: view,
                languageCode: ELanguages.ENGLISH,
                organizationId: IsNull(),
                tenantId: IsNull(),
            });

            const emailTemplate = await this.emailTemplateRepository.findOneBy(query);
            if (!emailTemplate) {
                return '';
            }

            const template = Handlebars.compile(emailTemplate.hbs);
            const html = template(locals);
            return html;
        } catch (error) {
            console.log('Error while rendering email template: %s', error);
            throw new InternalServerErrorException(error);
        }
    };
}
