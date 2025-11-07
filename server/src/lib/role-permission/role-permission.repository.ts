import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolePermissionRepository extends Repository<RolePermission> {
    constructor(@InjectRepository(RolePermission) readonly repository: Repository<RolePermission>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
