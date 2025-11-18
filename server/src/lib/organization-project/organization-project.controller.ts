import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TenantPermissionGuard } from '../shared/guards';
import { ProjectManagerOrPermissionGuard } from './guards/project-manager-or-permission.guard';
import { Permissions } from '../shared/decorators';
import { EPermissions, IOrganizationProject } from 'src/contracts';
import { SensitiveRelationsInterceptor } from '../core/interceptors/sensitive-relations.interceptor';
import { SensitiveRelations } from '../core/decorators';
import { ORGANIZATION_SENSITIVE_RELATIONS } from '../core/util/organization-sensitive-relations.config';
import { CrudController } from '../core/crud';
import { OrganizationProject } from './organization-project.entity';
import { OrganizationProjectService } from './organization-project.service';
import { CreateOrganizationProjectDTO } from './dto';
import { UseValidationPipe } from '../shared';
import { CommandBus } from '@nestjs/cqrs';
import { OrganizationProjectCreateCommand } from './commands';

@ApiTags('OrganizationProject')
@UseGuards(TenantPermissionGuard, ProjectManagerOrPermissionGuard)
@Permissions(EPermissions.ALL_ORG_EDIT, EPermissions.ORG_PROJECT_EDIT)
@UseInterceptors(SensitiveRelationsInterceptor)
@SensitiveRelations(ORGANIZATION_SENSITIVE_RELATIONS, 'organization')
@Controller('/organization-project')
export class OrganizationProjectController extends CrudController<OrganizationProject> {
    constructor(
        private readonly organizationProjectService: OrganizationProjectService,

        private readonly commandBus: CommandBus,
    ) {
        super(organizationProjectService);
    }

    @ApiOperation({ summary: 'Create a new organization project' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The organization project has been successfully created',
        type: CreateOrganizationProjectDTO,
    })
    @ApiBody({ description: 'Payload for creating the organization project', type: CreateOrganizationProjectDTO })
    @HttpCode(HttpStatus.CREATED)
    @Permissions(EPermissions.ALL_ORG_EDIT, EPermissions.ORG_PROJECT_ADD)
    @UseValidationPipe()
    @Post('/')
    async create(@Body() entity: CreateOrganizationProjectDTO): Promise<IOrganizationProject> {
        return await this.commandBus.execute(new OrganizationProjectCreateCommand(entity));
    }
}
