import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { ID, IUser, IUserOrganization } from 'src/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { User } from '../user/user.entity';

@Entity()
export class UserOrganization extends TenantOrganizationBaseEntity implements IUserOrganization {
    @ApiPropertyOptional({ type: () => Boolean, default: true })
    @IsOptional()
    @IsBoolean()
    @Index()
    @Column({ default: true })
    isDefault: boolean;

    @ManyToOne(() => User, (it) => it.organizations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user?: IUser;

    @ApiProperty({ type: () => String })
    @RelationId((it: UserOrganization) => it.user)
    @IsUUID()
    @Index()
    @Column({})
    userId?: ID;
}
