import { Injectable } from '@nestjs/common';
import { EmailTemplateRepository } from './email-template.repository';
import { CrudService } from '../core/crud';
import { EmailTemplate } from './email-template.entity';

@Injectable()
export class EmailTemplateService extends CrudService<EmailTemplate> {
    constructor(emailTemplateRepository: EmailTemplateRepository) {
        super(emailTemplateRepository);
    }
}
