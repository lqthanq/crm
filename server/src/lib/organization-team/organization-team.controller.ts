import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard, TenantPermissionGuard } from '../shared/guards';
import { Permissions } from '../shared/decorators';
import { EPermissions, IOrganizationTeam } from 'src/contracts';
import { SensitiveRelationsInterceptor } from '../core/interceptors/sensitive-relations.interceptor';
import { SensitiveRelations } from '../core/decorators';
import { ORGANIZATION_SENSITIVE_RELATIONS } from '../core/util/organization-sensitive-relations.config';
import { CrudController } from '../core/crud';
import { OrganizationTeam } from './organization-team.entity';
import { OrganizationTeamService } from './organization-team.service';
import { UseValidationPipe } from '../shared';
import { CreateOrganizationTeamDTO } from './dto';
import { CommandBus } from '@nestjs/cqrs';
import { OrganizationTeamCreateCommand } from './commands/organization-team.create.command';

@ApiTags('OrganizationTeam')
@UseGuards(TenantPermissionGuard, PermissionGuard)
@Permissions(EPermissions.ALL_ORG_EDIT, EPermissions.ORG_TEAM_EDIT)
@UseInterceptors(SensitiveRelationsInterceptor)
@SensitiveRelations(ORGANIZATION_SENSITIVE_RELATIONS, 'organization')
@Controller('/organization-team')
export class OrganizationTeamController extends CrudController<OrganizationTeam> {
    constructor(
        private readonly _organizationTeamService: OrganizationTeamService,
        private readonly _commandBus: CommandBus,
    ) {
        super(_organizationTeamService);
    }

    @ApiOperation({ summary: 'Create new record' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been successfully created.' })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong',
    })
    @HttpCode(HttpStatus.OK)
    @Permissions(EPermissions.ALL_ORG_EDIT, EPermissions.ORG_TEAM_ADD)
    @Post('/')
    @UseValidationPipe()
    async create(@Body() entity: CreateOrganizationTeamDTO): Promise<IOrganizationTeam> {
        return await this._commandBus.execute(new OrganizationTeamCreateCommand(entity));
    }
}
