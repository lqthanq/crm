import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './auth.controller';
import { CommandHandlers } from './commands/handler';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailSendModule } from '../email-send/email-send.module';
import { EventBusModule } from '../event-bus/event-bus.module';

// Core service providers for handling authentication and related functionalities
const providers = [AuthService, EmailConfirmationService];

@Module({
    imports: [UserModule, EmailSendModule, CqrsModule, EventBusModule],
    controllers: [AuthController],
    providers: [...providers, ...CommandHandlers],
})
export class AuthModule {}
