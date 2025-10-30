import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUser } from 'src/contracts';
import { AuthService } from '../../auth.service';
import { AuthRegisterCommand } from '../auth.register.command';

@CommandHandler(AuthRegisterCommand)
export class AuthRegisterHandler implements ICommandHandler<AuthRegisterCommand> {
    constructor(private readonly authService: AuthService) {}

    public async execute(command: AuthRegisterCommand): Promise<IUser> {
        const { input, languageCode } = command;

        // Register the user using the AuthService
        return await this.authService.register(input, languageCode);
    }
}
