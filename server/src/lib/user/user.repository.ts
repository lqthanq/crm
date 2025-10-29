import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(@InjectRepository(User) readonly repository: Repository<User>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
