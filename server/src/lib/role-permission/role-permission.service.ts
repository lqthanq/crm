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

    /**
     * Checks if the given role permissions are valid for the current tenant
     */
    public async checkRolePermission(
        tenantId: string,
        roleId: string,
        permissions: string[],
        includeRole: boolean = false,
    ): Promise<boolean> {
        // Create a query builder for the 'role_permission' entity
        const query = this.repository.createQueryBuilder('rp');

        // Add the condition for the current tenant Id
        query.where('rp.tenantId = :tenantId', { tenantId });

        // If includeRole is true, add the condition for the current role ID
        if (includeRole) {
            query.andWhere('rp.roleId = :roleId', { roleId });
        }

        // Add conditions for permissions, enabled, isActive, and isArchived
        query.andWhere('rp.permission IN(:...permissions)', { permissions });
        query.andWhere('rp.enabled = :enabled', { enabled: true });
        query.andWhere('rp.isActive = :isActive', { isActive: true });
        query.andWhere('rp.isArchived = :isArchived', { isArchived: false });

        // Execute the query and get the count
        const count = await query.getCount();

        return count > 0;
    }
}
