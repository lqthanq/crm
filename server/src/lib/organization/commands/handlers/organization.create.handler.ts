import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrganizationCreateCommand } from '../organization.create.command';
import { OrganizationService } from '../../organization.service';
import { ERoles, IOrganization, IUser } from 'src/contracts';
import { BadRequestException } from '@nestjs/common';
import { RequestContext } from 'src/lib/core';
import { UserService } from 'src/lib/user/user.service';
import { UserOrganizationService } from 'src/lib/user-organization/user-organization.service';

@CommandHandler(OrganizationCreateCommand)
export class OrganizationCreateHandler implements ICommandHandler<OrganizationCreateCommand> {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly organizationService: OrganizationService,
        private readonly userService: UserService,
        private readonly userOrganizationService: UserOrganizationService,
    ) {}

    public async execute(command: OrganizationCreateCommand): Promise<IOrganization> {
        try {
            const { input } = command;

            const tenantId = RequestContext.currentTenantId();

            // 1. Get all Admin of the Tenant
            const admins = await this.userService.find({
                where: {
                    tenantId: tenantId!,
                    role: {
                        name: ERoles.ADMIN,
                        tenantId: tenantId!,
                    },
                },
            });

            // 2. Create Organization
            const organization: IOrganization = await this.organizationService.create({
                ...input,
            });

            const { id: organizationId } = organization;

            // 3. Take each Adim user and add him/her to created organization
            try {
                const userOrganizations = admins.map(async (user: IUser) => {
                    const userOrganization = await this.userOrganizationService.create({
                        organization: {
                            id: organizationId,
                        },
                        user,
                    });

                    return userOrganization;
                });

                await Promise.all(userOrganizations);
            } catch (e) {
                console.log('An error occurred while processing user organizations. Details:', e);
            }

            // 4. Create contact details of creadted organization

            // 5. Executes various organization update tasks concurrently.

            // 6. Create Import Records while migrating for relation organization.

            return await this.organizationService.findOneByIdString(organizationId!);
        } catch (error) {
            console.log('An error occured during the organization creation process.', error);
            throw new BadRequestException(error, 'An error occurred during the organization creation process.');
        }
    }
}
