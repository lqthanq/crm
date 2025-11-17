import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ALPHA_NUMERIC_CODE_LENGTH } from 'src/constants';
import { IUserCodeInput } from 'src/contracts';
import { CustomLength } from 'src/lib/shared/validators';

export class UserCodeDTO implements IUserCodeInput {
    @ApiProperty({ type: () => Number })
    @IsString()
    @CustomLength(ALPHA_NUMERIC_CODE_LENGTH)
    readonly code: string;
}
