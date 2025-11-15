import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { UserOrganization } from './user-organization.entity';
import { UserOrganizationRepository } from './user-organization.repository';

@Injectable()
export class UserOrganizationService extends TenantAwareCrudService<UserOrganization> {
    constructor(readonly userOrganizationRepository: UserOrganizationRepository) {
        super(userOrganizationRepository);
    }
}
