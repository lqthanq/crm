import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, RelationId } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { IEmployee, IOrganizationProject, IUser } from 'src/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { User } from '../user/user.entity';
import { OrganizationProjectEmployee } from '../organization-project/organization-project-employee.entity';

@Entity()
export class Employee extends TenantOrganizationBaseEntity implements IEmployee {
    @ApiPropertyOptional({ type: () => Date })
    @IsOptional()
    @IsDateString()
    @Column({ nullable: true })
    startedWorkOn?: Date;

    @ApiPropertyOptional({ type: () => Date })
    @IsOptional()
    @IsDateString()
    @Column({ nullable: true })
    endWork?: Date;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Index()
    @Column({ length: 100, nullable: true })
    profile_link?: string;

    @ApiPropertyOptional({ type: () => Boolean })
    @IsOptional()
    @IsBoolean()
    @Column({ type: Boolean, nullable: true, default: false })
    isTrackingEnabled: boolean;

    fullName?: string;

    /**
     * @OneToOne
     */

    @OneToOne(() => User, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: IUser;

    @ApiProperty({ type: () => String })
    @RelationId((it: Employee) => it.user)
    @Index()
    @Column()
    userId: string;

    @OneToMany(() => OrganizationProjectEmployee, (it) => it.employee, {
        cascade: true,
    })
    projects?: IOrganizationProject[];

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
