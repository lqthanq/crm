import { Column, Entity, Index, ManyToOne, RelationId } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { ID, IOrganizationTeam, IOrganizationTeamEmployee } from 'src/contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { OrganizationTeam } from '../organization-team/organization-team.entity';

@Entity()
export class OrganizationTeamEmployee extends TenantOrganizationBaseEntity implements IOrganizationTeamEmployee {
    @ApiPropertyOptional({ type: () => Number })
    @IsOptional()
    @IsNumber()
    @Column({ nullable: true })
    order?: number;

    @ApiPropertyOptional({ type: () => Number })
    @IsOptional()
    @IsBoolean()
    @Column({ type: Boolean, nullable: true, default: true })
    isTrackingEnabled?: boolean;

    @ManyToOne(() => OrganizationTeam, (it) => it.members, {
        onDelete: 'CASCADE',
    })
    organizationTeam!: IOrganizationTeam;

    @ApiPropertyOptional({ type: () => Number })
    @IsNotEmpty()
    @IsUUID()
    @RelationId((it: OrganizationTeamEmployee) => it.organizationTeam)
    @Index()
    @Column()
    organizationTeamId: ID;

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
