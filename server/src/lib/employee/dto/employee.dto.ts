import { IntersectionType, PickType } from '@nestjs/swagger';
import { TenantOrganizationBaseDTO } from 'src/lib/core/dto';
import { Employee } from '../employee.entity';

export class EmployeeDTO extends IntersectionType(
    TenantOrganizationBaseDTO,
    PickType(Employee, ['startedWorkOn'] as const),
) {}
