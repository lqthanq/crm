import { ICommand } from '@nestjs/cqrs';
import { IAppIntegrationConfig } from 'src/common';
import { ELanguages, IUserRegistrationInput } from 'src/contracts';

export class AuthRegisterCommand implements ICommand {
    static readonly type = '[Auth] Register';

    constructor(
        public readonly input: IUserRegistrationInput & Partial<IAppIntegrationConfig>,
        public readonly languageCode: ELanguages,
    ) {}
}
