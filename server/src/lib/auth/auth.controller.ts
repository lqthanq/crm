import { Body, Controller, Headers, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common';
import { ELanguages, IUser } from 'src/contracts';
import { RegisterUserDTO } from '../user/dto';
import { AuthRegisterCommand } from './commands';

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
    async register(@Body() input: RegisterUserDTO, @Headers('origin') origin: string): Promise<IUser> {
        return await this.commandBus.execute(
            new AuthRegisterCommand({ original_url: origin, ...input }, ELanguages.ENGLISH),
        );
    }
}
