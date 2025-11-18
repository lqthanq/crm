import { Column, Entity, Index, OneToMany } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { IOrganizationProject, IOrganizationProjectEmployee } from 'src/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { OrganizationProjectEmployee } from './organization-project-employee.entity';

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

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
