import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EmailTemplate } from './email-template.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailTemplateRepository extends Repository<EmailTemplate> {
    constructor(@InjectRepository(EmailTemplate) readonly repository: Repository<EmailTemplate>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
