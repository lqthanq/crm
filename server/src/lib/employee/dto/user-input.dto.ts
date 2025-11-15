import { IsNotEmptyObject, IsObject } from 'class-validator';
import { IRole, IUser } from 'src/contracts';
import { CreateUserDTO } from 'src/lib/user/dto';

export class UserInputDTO extends CreateUserDTO implements IUser {
    @IsObject()
    @IsNotEmptyObject()
    role: IRole;
}
