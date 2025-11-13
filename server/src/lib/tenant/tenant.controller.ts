import { BadRequestException, Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { ERoles, ITenant } from 'src/contracts';
import { UseValidationPipe } from '../shared';
import { CreateTenantDTO } from './dto';
import { RequestContext } from '../core';

@ApiTags('Tenant')
@Controller('/tenant')
export class TenantController {
    constructor(private readonly tenantService: TenantService) {}

    /**
     * Create Owner Tenant
     */
    @ApiOperation({
        summary: 'Create new tenant. The user who creates the tenant is given the super admin role.',
        security: [
            {
                role: [ERoles.SUPER_ADMIN],
            },
        ],
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The record has been successfully created.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong',
    })
    @Post('/')
    @UseValidationPipe()
    async create(@Body() entity: CreateTenantDTO): Promise<ITenant> {
        const user = RequestContext.currentUser();
        if (user!.tenantId || user!.roleId) {
            throw new BadRequestException('Tenant already exists');
        }

        return await this.tenantService.onboardTenant(entity, user!);
    }
}
