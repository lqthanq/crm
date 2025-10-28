import type { IBasePerTenantEntityModel, ID, ITenant } from 'src/contracts';
import { BaseEntity, Tenant } from './internal';
import { Column, Index, ManyToOne, RelationId } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export abstract class TenantBaseEntity extends BaseEntity implements IBasePerTenantEntityModel {
    @ManyToOne(() => Tenant, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    tenant?: ITenant;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsUUID()
    @RelationId((t: TenantBaseEntity) => t.tenant)
    @Index()
    @Column({ nullable: true })
    tenant_id?: ID;
}
