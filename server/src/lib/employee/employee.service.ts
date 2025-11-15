import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { Employee } from './employee.entity';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService extends TenantAwareCrudService<Employee> {
    constructor(readonly employeeRepository: EmployeeRepository) {
        super(employeeRepository);
    }
}
