import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmployeeRepository extends Repository<Employee> {
    constructor(@InjectRepository(Employee) readonly repository: Repository<Employee>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
