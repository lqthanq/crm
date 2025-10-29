import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends TenantAwareCrudService<User> {
    constructor(readonly userRepository: UserRepository) {
        super(userRepository);
    }
}
