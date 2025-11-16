import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrganizationProject } from './organization-project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationProjectRepository extends Repository<OrganizationProject> {
    constructor(@InjectRepository(OrganizationProject) readonly repository: Repository<OrganizationProject>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
