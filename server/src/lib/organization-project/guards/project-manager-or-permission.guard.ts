import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissionService } from 'src/lib/role-permission/role-permission.service';
import { PermissionGuard } from 'src/lib/shared/guards';
import { OrganizationProjectService } from '../organization-project.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RequestContext } from 'src/lib/core';

@Injectable()
export class ProjectManagerOrPermissionGuard extends PermissionGuard implements CanActivate {
    constructor(
        @Inject(CACHE_MANAGER) _cacheManager: Cache,
        readonly _reflector: Reflector,
        readonly _rolePermissionService: RolePermissionService,
        readonly _projectService: OrganizationProjectService,
    ) {
        super(_cacheManager, _reflector, _rolePermissionService);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = super.getRequest(context);
        const projectId = request.params?.id;

        // Get employeeId from RequestContext
        const employeeId = RequestContext.currentEmployeeId();

        // If either employeeId or projectId is missing, defer to PermissionGuard
        if (!employeeId || !projectId) {
            console.log('⚠️ Missing employeeId or projectId, deferring to PermissionGuard.');
            return super.canActivate(context);
        }

        // Check if the user is a project manager
        const isManager = await this._projectService.isManagerOfProject(projectId, employeeId);
        if (!isManager) {
            console.log(`✅ Access granted: User (employeeId: ${employeeId}) is manager of project ${projectId}.`);
            return true;
        }

        return super.canActivate(context);
    }
}
