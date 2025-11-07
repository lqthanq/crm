import { Column, Entity, Index, ManyToOne, RelationId } from "typeorm";
import { TenantBaseEntity } from "../core/entities/tenant-base.entity";
import { EPermissions, IRolePermission } from "src/contracts";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../core/entities/internal";;

@Entity()
export class RolePermission extends TenantBaseEntity implements IRolePermission {
    @ApiProperty({ type: () => String, enum: EPermissions})
    @Index()
    @Column()
    permission: string;

    @ApiPropertyOptional({ type: () => Boolean, default: false })
    @Column({ nullable: true, default: false })
    enabled: boolean;

    @ApiPropertyOptional({ type: () => String})
    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Role, (it) => it.rolePermissions)
    role: Role;

    @ApiProperty({ type: () => String })
    @RelationId((it: RolePermission) => it.role)
    @Index()
    @Column({})
    roleId: string;
}
