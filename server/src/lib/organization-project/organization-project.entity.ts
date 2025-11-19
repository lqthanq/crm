import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { IOrganizationProject, IOrganizationProjectEmployee, IOrganizationTeam } from 'src/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { OrganizationProjectEmployee } from './organization-project-employee.entity';
import { OrganizationTeam } from '../organization-team/organization-team.entity';

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

    @OneToMany(() => OrganizationProjectEmployee, (it) => it.organizationProject, {
        cascade: true,
    })
    members?: IOrganizationProjectEmployee[];

    @ManyToMany(() => OrganizationTeam, (it) => it.projects, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinTable({ name: 'organization_project_team' })
    teams?: IOrganizationTeam[];

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
