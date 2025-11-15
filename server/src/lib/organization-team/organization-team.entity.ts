import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IOrganizationTeam, IOrganizationTeamEmployee } from 'src/contracts';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { OrganizationTeamEmployee } from '../organization-team-employee/organization-team-employee.entity';

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

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
