import { Module } from '@nestjs/common';
import { UserOrganizationModule } from 'src/lib/user-organization/user-organization.module';
import { OrganizationBelongsToUserConstraint, TenantBelongsToUserConstraint } from './constraints';

@Module({
    imports: [UserOrganizationModule],
    providers: [OrganizationBelongsToUserConstraint, TenantBelongsToUserConstraint],
})
export class ValidatorModule {}
