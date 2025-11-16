import { IntersectionType } from '@nestjs/swagger';
import { IUserEmailInput, IUserTokenInput } from 'src/contracts';
import { UserTokenDTO } from 'src/lib/user/dto';
import { UserEmailDTO } from 'src/lib/user/dto/user-email.dto';

export class ConfirmEmailByTokenDTO
    extends IntersectionType(UserEmailDTO, UserTokenDTO)
    implements IUserEmailInput, IUserTokenInput {}
