import { IntersectionType } from '@nestjs/swagger';
import { UserEmailDTO } from './user-email.dto';
import { UserPasswordDTO } from './user-password.dto';
import { IUserEmailInput, IUserPasswordInput } from 'src/contracts';

export class UserLoginDTO
    extends IntersectionType(UserEmailDTO, UserPasswordDTO)
    implements IUserEmailInput, IUserPasswordInput {}
