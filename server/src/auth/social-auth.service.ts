import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import bcrypt from 'bcrypt';

export abstract class BaseSocialAuth {
    public abstract validateOAuthLoginEmail(args: []): any;
}

@Injectable()
export class SocialAuthService extends BaseSocialAuth {
    protected readonly configService: ConfigService;
    protected readonly saltRounds: number;
    // protected readonly clientBaseUrl: string;

    constructor() {
        super();
        this.configService = new ConfigService();
        this.saltRounds = this.configService.get('USER_PASSWORD_BCRYPT_SALT_ROUNDS') as number;
    }

    public validateOAuthLoginEmail(args: []) {}

    public async getPasswordHash(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            console.error('Error in getPasswordHash:', error);
            throw new Error('Failed to hash the password');
        }
    }
}
