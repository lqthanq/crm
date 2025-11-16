import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from 'src/common';
import { ELanguages, IAuthResponse, IUser } from 'src/contracts';
import { RegisterUserDTO, UserLoginDTO } from '../user/dto';
import { AuthLoginCommand, AuthRegisterCommand } from './commands';
import { UseValidationPipe } from '../shared';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
    constructor(private readonly commandBus: CommandBus) {}

    /**
     * Register a new user
     */
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong',
    })
    @Post('/register')
    @Public()
    @UseValidationPipe({ transform: true })
    async register(@Body() input: RegisterUserDTO, @Headers('origin') origin: string): Promise<IUser | void> {
        return await this.commandBus.execute(
            new AuthRegisterCommand({ originalUrl: origin, ...input }, ELanguages.ENGLISH),
        );
    }

    /**
     * User login
     * 
     * @param input 
     * @returns 
     */
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    @Public()
    @UseValidationPipe({ transform: true })
    async login(@Body() input: UserLoginDTO): Promise<IAuthResponse | null> {
        return await this.commandBus.execute(new AuthLoginCommand(input));
    }
}
