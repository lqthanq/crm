import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject, IsObject, MinLength, ValidateNested } from 'class-validator';
import { IUserRegistrationInput } from 'src/contracts';
import { Match } from 'src/lib/shared/validators';
import { CreateUserDTO } from './create-user.dto';
import { Type } from 'class-transformer';

export class RegisterUserDTO implements IUserRegistrationInput {
    @ApiProperty({ type: () => String })
    @IsNotEmpty({ message: 'Password should not be empty' })
    @MinLength(4, {
        message: 'Password should be at least 4 characters long.',
    })
    readonly password: string;

    @ApiProperty({ type: () => String })
    @IsNotEmpty({ message: 'Confirm password should not be empty' })
    @Match(RegisterUserDTO, (it) => it.password, {
        message: 'The password and confirmation password must match.',
    })
    readonly confirmPassword: string;

    @ApiProperty({ type: () => CreateUserDTO })
    @IsObject()
    @IsNotEmptyObject()
    @IsNotEmpty({ message: 'User should not by empty' })
    @ValidateNested()
    @Type(() => CreateUserDTO)
    readonly user: CreateUserDTO;
}
