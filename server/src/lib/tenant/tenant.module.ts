import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { RoleModule } from '../role/role.module';

@Module({
    imports: [TypeOrmModule.forFeature([Tenant]), forwardRef(() => RoleModule)],
})
export class TenantModule {}
