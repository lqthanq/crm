import { Injectable } from '@nestjs/common';
import { SocialAuthService } from 'src/auth';
import { UserRepository } from '../user/user.repository';
import { IUserRegistrationInput } from 'src/contracts';
import { IAppIntegrationConfig } from 'src/common';

@Injectable()
export class AuthService extends SocialAuthService {
    constructor(private readonly userRepository: UserRepository) {
        super();
    }

    async register(input: IUserRegistrationInput & Partial<IAppIntegrationConfig>) {
        // 2. Register new user
        const entity = this.userRepository.create({
            ...input.user,
            ...(input.password ? { hash: await this.getPasswordHash(input.password) } : {}),
        });

        let user = await this.userRepository.save(entity);

        // 3. Create employee for specific user

        // 4. Email is automatically verified after accepting an invitation

        // 5. Find the latest registered user with role
        user = await this.userRepository.findOne({
            where: { id: user.id },
            // relations: { role: true }
        })

        // 6. If organizationId is provided, add the user to the organization

        // 7. Create Import Records while migrating for a relative user

     
        // Extract integration information
        // let integration = pick

        // 8. If the user's email is not verified, send an email verification
        if (!user.email_verified_at) {

        }

        // Publish the account registration event

        // 9. Send a welcome email to the user
    }
}
