import { Injectable } from '@nestjs/common';
import { CrudService } from '../core/crud';
import { Tenant } from './tenant.entity';
import { TenantRepository } from './tenant.repository';
import { ERoles, ITenant, ITenantCreateInput, IUser } from 'src/contracts';
import { CommandBus } from '@nestjs/cqrs';
import { TenantRoleBulkCreateCommand } from '../role/commands';
import { RoleRepository } from '../role/role.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class TenantService extends CrudService<Tenant> {
    constructor(
        readonly tenantRepository: TenantRepository,
        readonly commandBus: CommandBus,
        readonly roleRepository: RoleRepository,
        readonly userRepository: UserRepository,
    ) {
        super(tenantRepository);
    }

    /**
     * Onboard a tenant and assign roles to a user.
     */
    public async onboardTenant(entity: ITenantCreateInput, user: IUser): Promise<ITenant> {
        console.time('On Boarding Tenant');

        const tenant = await this.create(entity);

        // Create Role/Permissions to relative tenants
        await this.commandBus.execute(new TenantRoleBulkCreateCommand([tenant]));

        // Executes Runs update tasks for the newly created tenant.

        const tenantId = tenant.id;

        // Find SUPER_ADMIN role to relative tenant.
        const role = await this.roleRepository.findOneBy({
            tenantId,
            name: ERoles.ADMIN,
        });

        // Update the user entity to assign the specified tenant and role.
        await this.userRepository.update(user.id!, {
            tenant: { id: tenantId },
            role: { id: role!.id },
        });

        // Create Import Records while migrating for relative tenant
        console.timeEnd('On Boarding Tenant');

        return tenant;
    }
}
