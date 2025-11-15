import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard, TenantPermissionGuard } from '../shared/guards';
import { EPermissions, IEmployee } from 'src/contracts';
import { SensitiveRelationsInterceptor } from '../core/interceptors/sensitive-relations.interceptor';
import { ORGANIZATION_SENSITIVE_RELATIONS } from '../core/util/organization-sensitive-relations.config';
import { SensitiveRelations } from '../core/decorators';
import { CrudController } from '../core/crud';
import { Employee } from './employee.entity';
import { Permissions } from '../shared/decorators';
import { EmployeeService } from './employee.service';
import { UseValidationPipe } from '../shared';
import { CreateEmployeeDTO } from './dto';
import { CommandBus } from '@nestjs/cqrs';
import { EmployeeCreateCommand } from './commands';

@ApiTags('Employee')
@UseGuards(TenantPermissionGuard, PermissionGuard)
@Permissions(EPermissions.ORG_EMPLOYEES_EDIT)
@UseInterceptors(SensitiveRelationsInterceptor)
@SensitiveRelations(ORGANIZATION_SENSITIVE_RELATIONS, 'organization')
@Controller('/employee')
export class EmployeeController extends CrudController<Employee> {
    constructor(
        private readonly _employeeService: EmployeeService,
        private readonly _commandBus: CommandBus,
    ) {
        super(_employeeService);
    }

    /**
     * CREATE a new employee in the same tenant.
     */
    @ApiOperation({ summary: 'Create a new employee in the same tenant' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Employee record created successfully.' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input. Check the request body for potential issues.',
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('/')
    @UseValidationPipe({ transform: true })
    async create(@Body() entity: CreateEmployeeDTO): Promise<IEmployee> {
        return await this._commandBus.execute(new EmployeeCreateCommand(entity));
    }
}
