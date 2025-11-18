import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { Employee } from './employee.entity';
import { EmployeeRepository } from './employee.repository';
import { ID, IEmployee } from 'src/contracts';
import { FindOneOptions, In } from 'typeorm';

@Injectable()
export class EmployeeService extends TenantAwareCrudService<Employee> {
    constructor(readonly employeeRepository: EmployeeRepository) {
        super(employeeRepository);
    }

    /**
     * Finds an employee by user ID
     *
     * @param userId
     * @param options
     * @returns
     */
    async findOneByUserId(userId: ID, options?: FindOneOptions<Employee>): Promise<IEmployee | null> {
        try {
            const whereClause = {
                userId,
                isActive: true,
                isArchived: false,
            };

            const queryOptions: FindOneOptions<Employee> = {
                ...options,
                where: {
                    ...whereClause,
                    ...(options?.where || {}),
                },
            };

            return this.repository.findOne(queryOptions);
        } catch (error) {
            console.error(`Error finding employee by userId: ${error.message}`);
            return null;
        }
    }

    /**
     * Retrieves a list of active, no-archived employees based on provided employee IDs, Organization ID, and tenant ID.
     * @param employeeIds
     * @param organizationId
     * @param tenantId
     * @returns
     */
    async findActiveEmployeesByEmployeeIds(
        employeeIds: ID[] = [],
        organizationId: ID,
        tenantId: ID,
    ): Promise<IEmployee[]> {
        try {
            // Filter out any invalid values from the employee IDs array
            const filteredIds = employeeIds.filter(Boolean);

            return await this.employeeRepository.findBy({
                id: In(filteredIds),
                organizationId,
                tenantId,
                isActive: true,
                isArchived: false,
            });
        } catch (error) {
            console.error('Error while retrieving employees', error);
            throw new Error(`Failed to retrieve employees: ${error}`);
        }
    }
}
