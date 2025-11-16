import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthLoginCommand } from '../auth.login.command';
import { AuthService } from '../../auth.service';
import { IAuthResponse } from 'src/contracts';

@CommandHandler(AuthLoginCommand)
export class AuthLoginHandler implements ICommandHandler<AuthLoginCommand> {
    constructor(private readonly authService: AuthService) {}

    public async execute(command: AuthLoginCommand): Promise<IAuthResponse | null> {
        const { input } = command;
        const { email, password } = input;

        return await this.authService.login({ email, password });
    }
}
