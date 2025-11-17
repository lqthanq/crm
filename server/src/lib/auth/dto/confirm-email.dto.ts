import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { IBasePerTenantEntityModel, ITenant, IUserCodeInput, IUserEmailInput, IUserTokenInput } from 'src/contracts';
import { UserTokenDTO } from 'src/lib/user/dto';
import { UserCodeDTO } from 'src/lib/user/dto/user-code.dto';
import { UserEmailDTO } from 'src/lib/user/dto/user-email.dto';

export class ConfirmEmailByTokenDTO
    extends IntersectionType(UserEmailDTO, UserTokenDTO)
    implements IUserEmailInput, IUserTokenInput {}

export class ConfirmEmailByCodeDTO
    extends IntersectionType(UserEmailDTO, UserCodeDTO)
    implements IUserEmailInput, IUserCodeInput, IBasePerTenantEntityModel
{
    @ApiProperty({ type: () => String })
    @IsNotEmpty()
    @IsUUID()
    readonly tenantId: ITenant['id'];
}
