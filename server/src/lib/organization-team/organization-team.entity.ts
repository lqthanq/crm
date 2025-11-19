import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IOrganizationProject, IOrganizationTeam, IOrganizationTeamEmployee } from 'src/contracts';
import { Column, Entity, Index, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { OrganizationTeamEmployee } from '../organization-team-employee/organization-team-employee.entity';
import { OrganizationProject } from '../organization-project/organization-project.entity';

@Entity()
export class OrganizationTeam extends TenantOrganizationBaseEntity implements IOrganizationTeam {
    @ApiProperty({ type: () => String })
    @IsNotEmpty()
    @IsString()
    @Index()
    @Column()
    name: string;

    @OneToMany(() => OrganizationTeamEmployee, (it) => it.organizationTeam, {
        cascade: true,
    })
    members?: IOrganizationTeamEmployee[];

    @ManyToMany(() => OrganizationProject, (it) => it.teams, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    projects?: IOrganizationProject[];

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
