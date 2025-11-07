import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';
import { ERoles, IRole, ITenant, DEFAULT_SYSTEM_ROLES } from 'src/contracts';

@Injectable()
export class RoleService extends TenantAwareCrudService<Role> {
    constructor(readonly roleRepository: RoleRepository) {
        super(roleRepository);
    }

    /**
     * Create multiple roles for each tenant and saves them.
     */
    async createBulk(tenants: ITenant[]):Promise<IRole[] &Role[]> {
        const roles: IRole[] = [];
        const rolesNames = Object.values(ERoles);

        for await(const tenant of tenants) {
            for await (const name of rolesNames) {
                const role = new Role();
                role.name = name;
                role.tenant = tenant;
                role.isSystem = DEFAULT_SYSTEM_ROLES.includes(name);
                roles.push(role);
            }
        }

        return await this.repository.save(roles);
    }
}
