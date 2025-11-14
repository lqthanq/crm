import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionGuard, TenantPermissionGuard } from '../shared/guards';
import { Permissions } from '../shared/decorators';
import { EPermissions } from 'src/contracts';
import { SensitiveRelationsInterceptor } from '../core/interceptors/sensitive-relations.interceptor';
import { SensitiveRelations } from '../core/decorators';
import { ORGANIZATION_SENSITIVE_RELATIONS } from '../core/util/organization-sensitive-relations.config';
import { CrudController } from '../core/crud';
import { Organization } from './organization.entity';
import { OrganizationService } from './organization.service';
import { CommandBus } from '@nestjs/cqrs';
import { UseValidationPipe } from '../shared';

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
    // @ApiOperation({ summary: 'Create a new Organization for a specific tenant '})
    // @ApiResponse({ status: HttpStatus.CREATED, description: 'The Organization has been successfully created.', type: Organization}) 
    // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input, the response body may contain clues as to what went wrong.'})
    // @HttpCode(HttpStatus.CREATED)
    // @Post()
    // @UseValidationPipe({ transform: true })
}
