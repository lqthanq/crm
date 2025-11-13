import { EPermissions, IRole, IRolePermission, ITenant } from 'src/contracts';
import { DataSource } from 'typeorm';
import { DEFAULT_ROLE_PERMISSIONS } from './default-role-permissions';
import { RolePermission } from './role-permission.entity';

/**
 * Creates role permissions for each tenant and role.
 */
export const createRolePermissions = async (
    dataSource: DataSource,
    roles: IRole[],
    tenants: ITenant[],
): Promise<void> => {
    for (const tenant of tenants) {
        const rolePermissions: IRolePermission[] = [];

        // Loop through each default role permission configuration
        for (const { role: roleEnum, defaultEnabledPermissions } of DEFAULT_ROLE_PERMISSIONS) {
            const role = roles.find((dbRole: IRole) => dbRole.name === roleEnum && dbRole.tenant!.name === tenant.name);

            if (role) {
                const permissions = Object.values(EPermissions);

                rolePermissions.push(
                    ...permissions.map((permission) => {
                        const rolePermission = new RolePermission({
                            role,
                            permission,
                            enabled: defaultEnabledPermissions.includes(permission),
                            tenant,
                        });

                        return rolePermission;
                    }),
                );
            }
        }

        await dataSource.manager.save(rolePermissions);
    }
};
