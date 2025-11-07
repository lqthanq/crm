import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
    constructor(@InjectRepository(Role) readonly repository: Repository<Role>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
