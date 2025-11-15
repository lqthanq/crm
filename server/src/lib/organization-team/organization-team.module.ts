import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationTeam } from './organization-team.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { OrganziationTeamRepository } from './organization-team.repository';
import { CommandHandlers } from './commands/handlers';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { EmployeeModule } from '../employee/employee.module';
import { OrganizationTeamService } from './organization-team.service';
import { RoleModule } from '../role/role.module';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([OrganizationTeam]), RoleModule, RolePermissionModule, EmployeeModule],
    providers: [OrganizationTeamService, OrganziationTeamRepository, ...CommandHandlers],
})
export class OrganizationTeamModule {}
