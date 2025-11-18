import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrganizationProjectEmployee } from './organization-project-employee.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationProjectEmployeeRepository extends Repository<OrganizationProjectEmployee> {
    constructor(
        @InjectRepository(OrganizationProjectEmployee) readonly repository: Repository<OrganizationProjectEmployee>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
