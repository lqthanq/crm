import { Entity, Repository } from 'typeorm';
import { OrganizationTeamEmployee } from './organization-team-employee.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationTeamEmployeeRepository extends Repository<OrganizationTeamEmployee> {
    constructor(@InjectRepository(OrganizationTeamEmployee) readonly repository: Repository<OrganizationTeamEmployee>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
