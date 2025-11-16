import { IntersectionType } from '@nestjs/swagger';
import { OrganizationProjectDTO } from './organization-project.dto';
import { TenantOrganizationBaseDTO } from 'src/lib/core/dto';
import { IOrganizationProjectCreateInput } from 'src/contracts';

export class CreateOrganizationProjectDTO
    extends IntersectionType(OrganizationProjectDTO, TenantOrganizationBaseDTO)
    implements IOrganizationProjectCreateInput {}
