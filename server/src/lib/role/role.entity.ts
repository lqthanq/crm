import { Column, Entity, Index, OneToMany } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


import { TenantBaseEntity, RolePermission  } from '../core/entities/internal';
import { ERoles, IRole, IRolePermission } from 'src/contracts';

@Entity()
export class Role extends TenantBaseEntity implements IRole {
    @ApiProperty({ type: () => String, enum: ERoles })
    @IsNotEmpty()
    @Index()
    @Column()
    name: string;

    @ApiPropertyOptional({ type: () => Boolean, default: false })
    @IsOptional()
    @IsBoolean()
    @Column({ default: false })
    isSystem?: boolean;

    @OneToMany(() => RolePermission, (it) => it.role, { cascade: true })
    rolePermissions?: IRolePermission[];
}
