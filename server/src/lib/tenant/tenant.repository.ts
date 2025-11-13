import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TenantRepository extends Repository<Tenant> {
    constructor(@InjectRepository(Tenant) readonly repository: Repository<Tenant>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
