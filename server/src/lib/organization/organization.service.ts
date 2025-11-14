import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { Organization } from './organization.entity';
import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService extends TenantAwareCrudService<Organization> {
    constructor(readonly organizationRepository: OrganizationRepository) {
        super(organizationRepository);
    }
}
