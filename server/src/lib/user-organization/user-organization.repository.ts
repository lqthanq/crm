import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserOrganization } from './user-organization.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserOrganizationRepository extends Repository<UserOrganization> {
    constructor(@InjectRepository(UserOrganization) readonly repository: Repository<UserOrganization>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
