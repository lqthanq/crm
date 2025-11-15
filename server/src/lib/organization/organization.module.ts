import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { OrganizationRepository } from './organization.repository';
import { CommandHandlers } from './commands/handlers';
import { UserModule } from '../user/user.module';
import { UserOrganizationModule } from '../user-organization/user-organization.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Organization]),
        forwardRef(() => UserModule),
        forwardRef(() => UserOrganizationModule),
        forwardRef(() => RolePermissionModule),
    ],
    controllers: [OrganizationController],
    providers: [OrganizationService, OrganizationRepository, ...CommandHandlers],
})
export class OrganizationModule {}
