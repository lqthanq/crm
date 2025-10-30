import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailTemplateRenderService } from './email-template-render.service';
import { EmailSendService } from './email-send.service';
import { EmailTemplateModule } from '../email-template/email-template.module';

@Module({
    imports: [EmailTemplateModule],
    providers: [EmailService, EmailSendService, EmailTemplateRenderService],
    exports: [EmailService],
})
export class EmailSendModule {}
