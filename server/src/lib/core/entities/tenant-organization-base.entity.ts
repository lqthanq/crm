import type { IBasePerTenantAndOrganizationEntityModel, ID, IOrganization } from 'src/contracts';
import { Organization, TenantBaseEntity } from './internal';
import { Column, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export abstract class TenantOrganizationBaseEntity
    extends TenantBaseEntity
    implements IBasePerTenantAndOrganizationEntityModel
{
    @ManyToOne(() => Organization, {
        nullable: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    organization?: IOrganization;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsUUID()
    @RelationId((it: TenantOrganizationBaseEntity) => it.organization)
    @Index()
    @Column({ nullable: true })
    organizationId: ID;
}
