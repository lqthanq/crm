import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { RoleModule } from '../role/role.module';
import { TenantController } from './tenant.controller';
import { Tenant } from './tenant.entity';
import { TenantRepository } from './tenant.repository';
import { TenantService } from './tenant.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Tenant]),
        forwardRef(() => RoleModule),
        forwardRef(() => RolePermissionModule),
        forwardRef(() => UserModule),
    ],
    controllers: [TenantController],
    providers: [TenantService, TenantRepository],
})
export class TenantModule {}
