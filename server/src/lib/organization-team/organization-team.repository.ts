import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrganizationTeam } from './organization-team.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganziationTeamRepository extends Repository<OrganizationTeam> {
    constructor(@InjectRepository(OrganizationTeam) readonly repository: Repository<OrganizationTeam>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
