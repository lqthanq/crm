import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './role-permission.entity';
import { RoleModule } from '../role/role.module';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionRepository } from './role-permission.repository';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([RolePermission]), forwardRef(() => RoleModule)],
    providers: [RolePermissionService, RolePermissionRepository],
    exports: [RolePermissionService],
})
export class RolePermissionModule {}
