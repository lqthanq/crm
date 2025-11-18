import { Column, Entity, Index, ManyToOne, RelationId } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { ID, IEmployee, IOrganizationProject, IOrganizationProjectEmployee, IRole } from 'src/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Employee } from '../employee/employee.entity';
import { Role } from '../role/role.entity';
import { OrganizationProject } from './organization-project.entity';

@Entity()
export class OrganizationProjectEmployee extends TenantOrganizationBaseEntity implements IOrganizationProjectEmployee {
    @ApiPropertyOptional({ type: () => Boolean, default: false })
    @IsOptional()
    @IsBoolean()
    @Index()
    @Column({ type: Boolean, nullable: true, default: false })
    isManager?: boolean;

    @ApiPropertyOptional({ type: () => Date })
    @IsOptional()
    @IsDateString()
    @Index()
    @Column({ nullable: true })
    assignedAt?: Date;

    @ManyToOne(() => OrganizationProject, (it) => it.members, {
        onDelete: 'CASCADE',
    })
    organizationProject!: IOrganizationProject;

    @ApiPropertyOptional({ type: () => String })
    @IsNotEmpty()
    @IsUUID()
    @RelationId((it: OrganizationProjectEmployee) => it.organizationProject)
    @Index()
    @Column()
    organizationProjectId: ID;

    @ManyToOne(() => Employee, (it) => it.projects, {
        onDelete: 'CASCADE',
    })
    employee!: IEmployee;

    @ApiProperty({ type: () => String })
    @IsNotEmpty()
    @IsUUID()
    @RelationId((it: OrganizationProjectEmployee) => it.employee)
    @Index()
    @Column()
    employeeId?: ID;

    @ManyToOne(() => Role, {
        nullable: true,

        onDelete: 'CASCADE',
    })
    role!: IRole;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsUUID()
    @RelationId((it: OrganizationProjectEmployee) => it.role)
    @Index()
    @Column({ nullable: false })
    roleId?: ID;

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
