import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './email-template.entity';
import { EmailTemplateRepository } from './email-template.repository';

@Module({
    imports: [TypeOrmModule.forFeature([EmailTemplate])],
    providers: [EmailTemplateRepository],
    exports: [EmailTemplateRepository],
})
export class EmailTemplateModule {}
