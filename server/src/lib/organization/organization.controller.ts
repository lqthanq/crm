import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EPermissions, IOrganization } from 'src/contracts';
import { CrudController } from '../core/crud';
import { SensitiveRelations } from '../core/decorators';
import { SensitiveRelationsInterceptor } from '../core/interceptors/sensitive-relations.interceptor';
import { ORGANIZATION_SENSITIVE_RELATIONS } from '../core/util/organization-sensitive-relations.config';
import { UseValidationPipe } from '../shared';
import { Permissions } from '../shared/decorators';
import { PermissionGuard, TenantPermissionGuard } from '../shared/guards';
import { OrganizationCreateCommand } from './commands';
import { CreateOrganizationDTO } from './dto';
import { Organization } from './organization.entity';
import { OrganizationService } from './organization.service';

@ApiTags('Organization')
@UseGuards(TenantPermissionGuard, PermissionGuard)
@Permissions(EPermissions.ALL_ORG_EDIT)
@UseInterceptors(SensitiveRelationsInterceptor)
@SensitiveRelations(ORGANIZATION_SENSITIVE_RELATIONS)
@Controller('/organization')
export class OrganizationController extends CrudController<Organization> {
    constructor(
        private readonly organizationService: OrganizationService,
        private readonly commandBus: CommandBus,
    ) {
        super(organizationService);
    }

    /**
     * CREATE organization for a specific tenant
     */
    @ApiOperation({ summary: 'Create a new Organization for a specific tenant ' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The Organization has been successfully created.',
        type: Organization,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input, the response body may contain clues as to what went wrong.',
    })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    @UseValidationPipe({ transform: true })
    async create(@Body() entity: CreateOrganizationDTO): Promise<IOrganization> {
        return await this.commandBus.execute(new OrganizationCreateCommand(entity));
    }
}
