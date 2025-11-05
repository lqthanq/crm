import { Injectable } from '@nestjs/common';
import { pick } from 'underscore';

import { SocialAuthService } from 'src/auth';
import { UserRepository } from '../user/user.repository';
import { IUserRegistrationInput, ELanguages } from 'src/contracts';
import { IAppIntegrationConfig } from 'src/common';
import { User } from '../user/user.entity';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailService } from '../email-send/email.service';
import { RequestContext } from '../core/context';
import { AccountRegistrationEvent } from '../event-bus/events';
import { EventBus } from '../event-bus/event-bus';

@Injectable()
export class AuthService extends SocialAuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly emailService: EmailService,
        private readonly eventBus: EventBus,
    ) {
        super();
    }

    async register(input: IUserRegistrationInput & Partial<IAppIntegrationConfig>, languageCode: ELanguages) {
        // 2. Register new user
        const entity = this.userRepository.create({
            ...input.user,
            ...(input.password ? { hash: await this.getPasswordHash(input.password) } : {}),
        });

        let user = await this.userRepository.save(entity);

        // 3. Create employee for specific user

        // 4. Email is automatically verified after accepting an invitation

        // 5. Find the latest registered user with role
        user = (await this.userRepository.findOne({
            where: { id: user.id },
            relations: {},
        })) as User;

        // 6. If organizationId is provided, add the user to the organization

        // 7. Create Import Records while migrating for a relative user

        // Extract integration information
        let integration = pick(input, ['appName', 'appEmailConfirmationUrl']);

        // 8. If the user's email is not verified, send an email verification
        if (!user.emailVerifiedAt) {
            this.emailConfirmationService.sendEmailVerification(user, integration);
        }

        // Publish the account registration event
        const ctx = RequestContext.currentRequestContext();
        const event = new AccountRegistrationEvent(ctx, user);
        this.eventBus.publish(event);

        // 9. Send a welcome email to the user
        this.emailService.welcomeUser(input.user, languageCode, undefined, undefined, integration);
        return user;
    }
}
