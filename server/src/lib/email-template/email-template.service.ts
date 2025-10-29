import { Injectable } from '@nestjs/common';
import { EmailTemplateRepository } from './email-template.repository';

@Injectable()
export class EmailTemplateService {
    constructor(emailTemplateRepository: EmailTemplateRepository) {
        // super(emailTemplateRepository)
    }
}
