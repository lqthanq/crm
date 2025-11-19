import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationTeam } from './organization-team.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { OrganizationTeamRepository } from './organization-team.repository';
import { CommandHandlers } from './commands/handlers';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { EmployeeModule } from '../employee/employee.module';
import { OrganizationTeamService } from './organization-team.service';
import { RoleModule } from '../role/role.module';
import { OrganizationTeamController } from './organization-team.controller';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([OrganizationTeam]),
        RoleModule,
        RolePermissionModule,
        EmployeeModule,
    ],
    controllers: [OrganizationTeamController],
    providers: [OrganizationTeamService, OrganizationTeamRepository, ...CommandHandlers],
})
export class OrganizationTeamModule {}
