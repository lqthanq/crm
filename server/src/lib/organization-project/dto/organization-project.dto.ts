import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { OrganizationProject } from '../organization-project.entity';
import { MemberEntityBasedDTO } from 'src/lib/core/dto';

export class OrganizationProjectDTO extends IntersectionType(
    PickType(OrganizationProject, ['name'] as const),
    IntersectionType(MemberEntityBasedDTO),
) {}
