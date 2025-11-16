import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { Employee } from './employee.entity';
import { EmployeeRepository } from './employee.repository';
import { ID, IEmployee } from 'src/contracts';
import { FindOneOptions } from 'typeorm';

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
}
