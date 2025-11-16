import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IUserPasswordInput } from 'src/contracts';

export class UserPasswordDTO implements IUserPasswordInput {
    @ApiProperty({ type: () => String })
    @IsNotEmpty()
    readonly password: string;
}
