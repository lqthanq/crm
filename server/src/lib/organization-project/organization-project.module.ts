import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationProjectRepository } from './organization-project.repository';
import { OrganizationProjectService } from './organization-project.service';
import { OrganizationProjectEmployee } from './organization-project-employee.entity';
import { OrganizationProjectEmployeeRepository } from './organization-project-employee.repository';
import { CommandHandlers } from './commands/handlers';
import { OrganizationProject } from './organization-project.entity';
import { RoleModule } from '../role/role.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([OrganizationProject, OrganizationProjectEmployee]),
        RoleModule,
        EmployeeModule,
    ],
    providers: [
        OrganizationProjectService,
        OrganizationProjectRepository,
        OrganizationProjectEmployeeRepository,
        ...CommandHandlers,
    ],
})
export class OrganizationProjectModule {}
