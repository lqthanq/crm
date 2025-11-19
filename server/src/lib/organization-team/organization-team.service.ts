import { EventBus } from '@nestjs/cqrs';
import { In } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { TenantAwareCrudService } from '../core/crud';
import { OrganizationTeam } from './organization-team.entity';
import { OrganizationTeamRepository } from './organization-team.repository';
import { EmployeeRepository } from '../employee/employee.repository';
import {
    EBaseEntity,
    EEntitySubscriptionType,
    ERoles,
    ID,
    IOrganizationTeam,
    IOrganizationTeamCreateInput,
} from 'src/contracts';
import { Employee } from '../employee/employee.entity';
import { RequestContext } from '../core';
import { RoleService } from '../role/role.service';
import { OrganizationTeamEmployee } from '../organization-team-employee/organization-team-employee.entity';
import { CreateEntitySubscriptionEvent } from '../entity-subscription/events/entity-subscription.create.event';

@Injectable()
export class OrganizationTeamService extends TenantAwareCrudService<OrganizationTeam> {
    constructor(
        readonly organizationTeamRepository: OrganizationTeamRepository,
        private readonly employeeRepository: EmployeeRepository,
        private readonly roleService: RoleService,
        private readonly _eventBus: EventBus,
    ) {
        super(organizationTeamRepository);
    }

    async create(input: IOrganizationTeamCreateInput): Promise<IOrganizationTeam> {
        const { memberIds = [], managerIds = [], projects = [] } = input;
        const { name, organizationId } = input;

        try {
            const tenantId = RequestContext.currentTenantId();
            const employeeId = RequestContext.currentEmployeeId() as string;
            const currentRoleId = RequestContext.currentRoleId();

            // If, employee create teams, default and as a manager
            try {
                // Check if the current role is EMPLOYEE
                await this.roleService.findOneByIdString(currentRoleId!, {
                    where: { name: ERoles.EMPLOYEE },
                });

                // Check if the employeeId is not already includes in the managerIds array
                if (!managerIds.includes(employeeId)) {
                    managerIds.push(employeeId);
                }
            } catch (error) {}

            // Retrieves a collection of employees based on specified criteria.
            const employees = await this.retrieveEmployees(memberIds, managerIds, organizationId!, tenantId!);

            // Find the manager role
            const managerRole = await this.roleService.findOneByWhereOptions({ name: ERoles.MANAGER });

            const managerIdsSet = new Set(managerIds);

            const members = employees.map(
                ({ id: employeeId }) =>
                    new OrganizationTeamEmployee({
                        employee: { id: employeeId },
                        organization: { id: organizationId },
                        tenant: { id: tenantId },
                        role: managerIdsSet.has(employeeId!) ? managerRole : null,
                    }),
            );

            // Create the organization team with the prepared members
            const organizationTeam = await super.create({
                organization: { id: organizationId },
                tenant: { id: tenantId! },
                name,
                members,
                projects,
            });

            // Subscribe creator and assignee to the team
            try {
                await Promise.all(
                    employees.map((employee) =>
                        this._eventBus.publish(
                            new CreateEntitySubscriptionEvent({
                                entity: EBaseEntity.OrganizationTeam,
                                entityId: organizationTeam.id!,
                                employeeId: employee.id,
                                type:
                                    employee.id === employeeId
                                        ? EEntitySubscriptionType.CREATED_ENTITY
                                        : EEntitySubscriptionType.ASSIGNMENT,
                                organizationId,
                                tenantId: tenantId!,
                            }),
                        ),
                    ),
                );
            } catch (error) {
                console.error('Error publishing CreateSubscriptionEvent:', error);
            }

            return organizationTeam;
        } catch (error) {
            throw new BadRequestException(`Failed to create a team: ${error}`);
        }
    }

    /**
     * Retrieves a collection of employees based on specified criteria.
     *
     * @param memberIds
     * @param managerIds
     * @param organizationId
     * @param tenantId
     * @returns
     */
    async retrieveEmployees(
        memberIds: ID[],
        managerIds: ID[],
        organizationId: string,
        tenantId: string,
    ): Promise<Employee[]> {
        try {
            // Filter out falsy values from the union of memberIds and managerIds
            const filteredIds = [...memberIds, ...managerIds].filter(Boolean);

            const employees = await this.employeeRepository.findBy({
                id: In(filteredIds),
                organizationId,
                tenantId,
            });

            return employees;
        } catch (error) {
            throw new Error(`Failed to retrieve employees: ${error}`);
        }
    }
}
