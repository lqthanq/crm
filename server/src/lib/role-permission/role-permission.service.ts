import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { RolePermission } from './role-permission.entity';
import { RolePermissionRepository } from './role-permission.repository';
import { EPermissions, IRolePermission, ITenant } from 'src/contracts';
import { RoleService } from '../role/role.service';
import { DEFAULT_ROLE_PERMISSIONS } from './default-role-permissions';

@Injectable()
export class RolePermissionService extends TenantAwareCrudService<RolePermission> {
    constructor(
        readonly rolePermisionRepository: RolePermissionRepository,
        private readonly _roleService: RoleService,
    ) {
        super(rolePermisionRepository);
    }

    public async updateRolesAndPermissions(tenants: ITenant[]): Promise<(IRolePermission[] & RolePermission[]) | void> {
        if (!tenants.length) {
            return;
        }

        const rolesPermissions: IRolePermission[] = [];
        for await (const tenant of tenants) {
            const roles = (
                await this._roleService.findAll({
                    where: {
                        tenantId: tenant.id,
                    },
                })
            ).items;

            for await (const role of roles) {
                const defaultPermissions = DEFAULT_ROLE_PERMISSIONS.find(
                    (defaultRole) => role.name === defaultRole.role,
                );

                const permissions = Object.values(EPermissions);

                for await (const permission of permissions) {
                    if (defaultPermissions) {
                        const { defaultEnabledPermissions = [] } = defaultPermissions;
                        const rolePermission = new RolePermission();
                        rolePermission.roleId = role.id!;
                        rolePermission.permission = permission;
                        rolePermission.enabled = defaultEnabledPermissions.includes(permission);
                        rolePermission.tenant = tenant;
                        rolesPermissions.push(rolePermission);
                    }
                }
            }
        }

        await this.repository.save(rolesPermissions);
        return rolesPermissions;
    }
}
