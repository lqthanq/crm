import { Column, Entity, Index } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { IOrganizationProject } from 'src/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

@Entity()
export class OrganizationProject extends TenantOrganizationBaseEntity implements IOrganizationProject {
    @ApiProperty({ type: () => String })
    @IsNotEmpty()
    @Index()
    @Column()
    name: string;

    @ApiPropertyOptional({ type: () => Boolean })
    @IsOptional()
    @IsBoolean()
    @Column({ nullable: true })
    public?: boolean;

    @Column({ nullable: true, default: 0 })
    membersCount?: number;

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
