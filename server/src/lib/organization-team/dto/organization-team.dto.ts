import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { IOrganizationProject, IOrganizationTeam } from 'src/contracts';
import { MemberEntityBasedDTO, TenantOrganizationBaseDTO } from 'src/lib/core/dto';
import { OrganizationProject } from 'src/lib/organization-project/organization-project.entity';

export class OrganizationTeamDTO
    extends IntersectionType(IntersectionType(TenantOrganizationBaseDTO, IntersectionType(MemberEntityBasedDTO)))
    implements Omit<IOrganizationTeam, 'name'>
{
    @ApiPropertyOptional({ type: () => Boolean })
    @IsOptional()
    @IsBoolean()
    readonly public?: boolean;

    @ApiPropertyOptional({ type: () => OrganizationProject, isArray: true })
    @IsOptional()
    @IsArray()
    readonly projects?: IOrganizationProject[] = [];
}
