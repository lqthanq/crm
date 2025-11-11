import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { IBasePerTenantEntityModel, ID, ITenant } from 'src/contracts';
import { Column, Index, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity, Tenant } from '../entities/internal';

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
    tenantId?: ID;
}
