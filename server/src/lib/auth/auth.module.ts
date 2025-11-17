import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthController } from './auth.controller';
import { CommandHandlers } from './commands/handler';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailSendModule } from '../email-send/email-send.module';
import { EventBusModule } from '../event-bus/event-bus.module';
import { EmployeeModule } from '../employee/employee.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FeatureModule } from '../feature/feature.module';
import { EmailVerificationController } from './email-verification.controller';

// Core service providers for handling authentication and related functionalities
const providers = [AuthService, EmailConfirmationService];

const strategies = [JwtStrategy];

@Module({
    imports: [UserModule, EmailSendModule, CqrsModule, EmployeeModule, FeatureModule, EventBusModule],
    controllers: [AuthController, EmailVerificationController],
    providers: [...providers, ...CommandHandlers, ...strategies],
})
export class AuthModule {}
