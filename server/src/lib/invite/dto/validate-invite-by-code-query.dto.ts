import { IntersectionType } from '@nestjs/swagger';
import { IUserCodeInput, IUserEmailInput } from 'src/contracts';
import { UserCodeDTO } from 'src/lib/user/dto';
import { UserEmailDTO } from 'src/lib/user/dto/user-email.dto';

export class ValidateInviteByCodeQueryDTO
    extends IntersectionType(UserEmailDTO, UserCodeDTO)
    implements IUserEmailInput, IUserCodeInput {}
