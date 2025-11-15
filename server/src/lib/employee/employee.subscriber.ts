import { EntityManager, EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { Employee } from './employee.entity';
import { UserOrganization } from '../user-organization/user-organization.entity';
import { extractNameFromEmail, sluggable } from 'src/utils';
import { Organization } from '../organization/organization.entity';

@EventSubscriber()
export class EmployeeSubscriber extends BaseEntityEventSubscriber<Employee> {
    listenTo() {
        return Employee;
    }

    /**
     * Called after an Emoployee entity is loaded from the database
     *
     * @param entity
     */
    async afterEntityLoad(entity: Employee): Promise<void> {
        try {
            // Set fullName from the associated user's name, if available
            if (Object.prototype.hasOwnProperty.call(entity, 'user')) {
                await this.setFullName(entity);
            }
        } catch (error) {
            console.error('EmployeeSubcriber: An error occured during the afterEntityLoad process:', error.message);
        }
    }

    /**
     * Called before entity is inserted/created to the database
     *
     * @param entity
     * @param em
     */
    async beforeEntityCreate(entity: Employee, em?: EntityManager): Promise<void> {
        try {
            // Set profile_link from the associated user's info, if available
            if (Object.prototype.hasOwnProperty.call(entity, 'user')) {
                await this.createSlug(entity);
            }

            // Set a default avater image if none si provided

            // Updates the employee's status based on the start and end work dates.
            this.updateEmployeeStatus(entity, em!);
        } catch (error) {
            console.error(`EmployeeSubscriber: An error occured during the beforeEntityCreate process:`, error.message);
        }
    }

    /**
     * Called before the entity is updated in the database.
     *
     * @param entity
     * @param em
     */
    async beforeEntityUpdate(entity: Employee, em?: EntityManager): Promise<void> {
        try {
            // Updates the employee's status based on the start and end work dates.
            this.updateEmployeeStatus(entity, em!);
        } catch (error) {
            console.error(
                'EmployeeSubscriber: An error occurred during the beforeEntityUpdate process:',
                error.message,
            );
        }
    }

    /**
     * Called after an entity is inserted/created in the database.
     *
     * @param entity
     * @param em
     */
    async afterEntityCreate(entity: Employee, em?: EntityManager): Promise<void> {
        try {
            if (entity) {
                await this.calculateTotalEmployees(entity, em!);
            }
        } catch (error) {
            console.error('EmployeeSubscriber: An error occurred during the afterEntityCreate process:', error.message);
        }
    }

    /**
     * Called after an entity is removed from the database.
     *
     * @param entity
     * @param em
     */
    async afterEntityDelete(entity: Employee, em?: EntityManager): Promise<void> {
        try {
            if (entity) {
                await this.calculateTotalEmployees(entity, em!);
            }
        } catch (error) {
            console.error('EmployeeSubscriber: An error occured during the afterEntityDelete process:', error);
        }
    }

    /**
     * Calculates and updates the total number of employees for an organization.
     * @param entity
     * @param em
     * @returns
     */
    async calculateTotalEmployees(entity: Employee, em: EntityManager): Promise<void> {
        try {
            const { organizationId, tenantId } = entity;
            if (!organizationId) return;

            // Determine the total number of employees
            const totalEmployees = await em.countBy(Employee, { organizationId, tenantId });

            // Update the organization with the calculated total employees
            const criteria = { id: organizationId, tenantId };
            const partialEntity = { totalEmployees };

            await em.update(Organization, criteria, partialEntity);
        } catch (error) {
            console.error('EmployeeSubscriber: Error while updating total employee count of the organization:', error);
        }
    }

    /**
     * Creates a slug for an Employee entity based on the associated User's information.
     * @param entity
     * @returns
     */
    async createSlug(entity: Employee): Promise<void> {
        try {
            if (!entity?.user) {
                console.error('Entity or User object is not defined.');
                return;
            }

            const { firstName, lastName, email } = entity.user;

            // Determine the slug based on the available fields in order of preference
            const slugSource =
                firstName?.trim() || lastName?.trim()
                    ? [firstName, lastName]
                          .filter(Boolean)
                          .map((name) => name?.trim())
                          .join(' ')
                    : extractNameFromEmail(email!);

            entity.profile_link = sluggable(slugSource);
        } catch (error) {
            console.error(`EmployeeSubscriber: Error creating slug for entity with id ${entity.id}:`, error);
        }
    }

    /**
     * Updates the employee's status and user's status based on the start and end work dates.
     *
     * @param entity
     * @param em
     */
    private updateEmployeeStatus(entity: Employee, em: EntityManager): void {
        const hasStartedWork = !!entity.startedWorkOn;
        const hasEndedWork = !!entity.endWork;

        // Update the employee's status based on the work dates
        if (hasStartedWork || hasEndedWork) {
            this.setEmployeeStatus(entity, hasStartedWork, hasEndedWork);
            this.setUserOrganizationStatus(em, entity, hasStartedWork, hasEndedWork);

            if (hasStartedWork) {
                entity.endWork = undefined; // Clear the end work date if the employe has started work
            }
        }
    }

    /**
     * Sets the employee's status flags and user tracking permissions.
     *
     * @param entity
     * @param isActive
     * @param isArchived
     */
    private setEmployeeStatus(entity: Employee, isActive: boolean, isArchived: boolean): void {
        entity.isTrackingEnabled = isActive;
        entity.isActive = isActive;
        entity.isArchived = isArchived;
    }

    /**
     * Updates the status (active and archived) of a user organization entity based on the associated employee's details.
     * @param em
     * @param entity
     * @param isActive
     * @param isArchived
     * @returns
     */
    async setUserOrganizationStatus(em: EntityManager, entity: Employee, isActive: boolean, isArchived: boolean) {
        try {
            // Early return if entity.id is missing
            if (!entity.id) return;

            // Get the employee ID and tenant ID from the entity
            const { id, tenantId, organizationId } = entity;

            // Fetch the employee entity
            const employee = await em.findOne(Employee, { where: { id, organizationId, tenantId } });

            if (!employee) {
                console.warn('Employeee or associated user not found.');
                return;
            }

            // Get the user ID from the employee
            const userId = employee.userId;

            // Update the UserOrganization status
            await em.update(UserOrganization, { userId, organizationId }, { isActive, isArchived });
        } catch (error) {
            console.error('EmployeeSubscriber: Error while updating user organization as active/inactive:', error);
        }
    }

    /**
     * Sets the full name for the employee entity based on the associated user's name.
     * @param entity
     */
    private async setFullName(entity: Employee): Promise<void> {
        if (entity?.user?.name) {
            entity.fullName = entity.user.name;
        }
    }
}
