import {
    EBaseEntity,
    EEntitySubscriptionType,
    ERoles,
    ID,
    IEmployee,
    IOrganizationProject,
    IOrganizationProjectCreateInput,
} from 'src/contracts';
import { TenantAwareCrudService } from '../core/crud';
import { OrganizationProject } from './organization-project.entity';
import { OrganizationProjectRepository } from './organization-project.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestContext } from '../core';
import { RoleService } from '../role/role.service';
import { EmployeeService } from '../employee/employee.service';
import { OrganizationProjectEmployee } from './organization-project-employee.entity';
import { EventBus } from '@nestjs/cqrs';
import { CreateEntitySubscriptionEvent } from '../entity-subscription/events/entity-subscription.create.event';

@Injectable()
export class OrganizationProjectService extends TenantAwareCrudService<OrganizationProject> {
    constructor(
        readonly organizationProjectRepository: OrganizationProjectRepository,
        private readonly _roleService: RoleService,
        private readonly _employeeService: EmployeeService,
        private readonly _eventBus: EventBus,
    ) {
        super(organizationProjectRepository);
    }

    async create(input: IOrganizationProjectCreateInput): Promise<IOrganizationProject> {
        const tenantId = RequestContext.currentTenantId() ?? input.tenantId;
        const employeeId = RequestContext.currentEmployeeId()!;
        const currentRoleId = RequestContext.currentRoleId()!;

        const { memberIds = [], managerIds = [], organizationId, ...entity } = input;

        try {
            try {
                // Check if the current role is EMPLOYEE
                await this._roleService.findOneByIdString(currentRoleId, {
                    where: { name: ERoles.EMPLOYEE },
                });

                // Add the current employee to the managerIds if they have the EMPLOYEE role and are not already included
                if (!managerIds.includes(employeeId)) {
                    // If not included, add the employeeId to the managerIds array
                    managerIds.push(employeeId);
                }
            } catch (error) {}

            // Combine memberIds and managerIds into a single array
            const employeeIds = [...memberIds, ...managerIds].filter(Boolean);

            // Retrieves a collection of employees based on specified criteria.
            const employees = await this._employeeService.findActiveEmployeesByEmployeeIds(
                employeeIds,
                organizationId!,
                tenantId!,
            );

            // Find the manager role
            const managerRole = await this._roleService.findOneByWhereOptions({ name: ERoles.MANAGER });

            const managerIdsSet = new Set(managerIds);

            // Use desctructing to directly extract 'id' from 'employee'
            const members = employees.map(({ id: employeeId }) => {
                // If the employee is a manager, assign the exisiting manager witht the latest assignedAt date
                const isManager = managerIdsSet.has(employeeId!);
                const assignedAt = new Date();

                return new OrganizationProjectEmployee({
                    employeeId,
                    organizationId,
                    tenantId,
                    isManager,
                    assignedAt,
                    role: isManager ? managerRole : null,
                });
            });

            // Create the organization project with the prepared members
            const project = await super.create({
                ...entity,
                members,
                // tags
                organizationId,
                tenantId,
            });

            // Subscribe creator and assignees to the project
            try {
                await Promise.all(
                    employees.map(({ id }: IEmployee) =>
                        this._eventBus.publish(
                            new CreateEntitySubscriptionEvent({
                                entity: EBaseEntity.OrganizationProject,
                                entityId: project.id!,
                                employeeId: id,
                                type:
                                    id === employeeId
                                        ? EEntitySubscriptionType.CREATED_ENTITY
                                        : EEntitySubscriptionType.ASSIGNMENT,
                                organizationId,
                                tenantId,
                            }),
                        ),
                    ),
                );
            } catch (error) {
                console.error('Error subscribing creators and assignees to the project:', error);
            }

            // Generate the activity log

            // Return the created project
            return project;
        } catch (error) {
            // Handle errors and return an appropriate error response
            throw new HttpException(`Failed to create organization project: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Checks if a given employee is a manager of a specific project.
     *
     * @param projectId
     * @param employeeId
     * @returns
     */
    async isManagerOfProject(projectId: ID, employeeId: ID): Promise<boolean> {
        const project = await this.repository
            .createQueryBuilder('project')
            .innerJoin('project.members', 'members')
            .where('project.id = :projectId', { projectId })
            .andWhere('members.employeeId = :employeeId', { employeeId })
            .andWhere('members.isActive = :isActive', { isActive: true })
            .andWhere('members.isArchived = :isArchived', { isArchived: false })
            .andWhere('members.isManager = :isManager', { isManager: true })
            .getOne();

        return !!project;
    }
}
