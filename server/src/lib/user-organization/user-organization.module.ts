import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrganization } from './user-organization.entity';
import { UserOrganizationService } from './user-organization.service';
import { UserOrganizationRepository } from './user-organization.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserOrganization])],
    providers: [UserOrganizationService, UserOrganizationRepository],
    exports: [UserOrganizationService, UserOrganizationRepository],
})
export class UserOrganizationModule {}
