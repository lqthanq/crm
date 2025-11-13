import { DEFAULT_SYSTEM_ROLES, ERoles, IRole, ITenant } from 'src/contracts';
import { DataSource } from 'typeorm';
import { Role } from './role.entity';

export const createRoles = async (dataSource: DataSource, tenants: ITenant[]): Promise<IRole[]> => {
    const roles: IRole[] = [];

    try {
        for (const tenant of tenants) {
            for (const name of Object.values(ERoles)) {
                const role = new Role({ name, tenant, isSystem: DEFAULT_SYSTEM_ROLES.includes(name) });

                roles.push(role);
            }
        }

        return await dataSource.manager.save(roles);
    } catch (error) {
        console.log({ error });
    }

    return roles;
};
