import { ID, IMemberEntityBased } from 'src/contracts';
import { TenantOrganizationBaseDTO } from './tenant-organization-base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class MemberEntityBasedDTO extends TenantOrganizationBaseDTO implements IMemberEntityBased {
    @ApiPropertyOptional({ type: Array })
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    memberIds?: ID[];

    @ApiPropertyOptional({ type: Array })
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    managerIds?: ID[];
}
