import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { isJSON } from 'class-validator';
import { Request } from 'express';
import { ERequestMethod } from 'src/contracts';
import { RequestContext } from 'src/lib/core';

@Injectable()
export class TenantBaseGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('TenantBaseGuard canActivate called');

        const currentTenantId = RequestContext.currentTenantId();
        const request: Request = context.switchToHttp().getRequest();
        const method = request.method as ERequestMethod;

        const { query, headers, rawHeaders } = request;

        let isAuthorized = false;
        if (!currentTenantId) {
            console.log('Guard TenantBase: Unauthorized access blocked. TenantId:', currentTenantId);
            return isAuthorized;
        }

        const headerTenantId = headers['tenant-id'];

        if (headerTenantId && (rawHeaders.includes('tenant_id') || rawHeaders.includes('Tenant-Id'))) {
            isAuthorized = currentTenantId === headerTenantId;
        } else {
            // If request to get/delete data using another tenantId then reject request
            const httpMethods = [ERequestMethod.GET, ERequestMethod.DELETE];
            if (httpMethods.includes(method)) {
                if ('tenantId' in query) {
                    const queryTenantId = query['tenantId'];
                    isAuthorized = currentTenantId === queryTenantId;
                } else if (query.hasOwnProperty('data')) {
                    const data: any = query.data;
                    const isJson = isJSON(data);
                    if (isJson) {
                        try {
                            const parse = JSON.parse(data);

                            if ('findInput' in parse && 'tenantId' in parse['findInput']) {
                                const queryTenantId = parse['findInput']['tenantId'];
                                isAuthorized = currentTenantId === queryTenantId;
                            } else {
                                // If tenantId not found in query params;
                                return false;
                            }
                        } catch (err) {
                            console.log('Json Parser Error:', err);
                            return isAuthorized;
                        }
                    }
                } else {
                    // If tenantId not found in query params
                    isAuthorized = false;
                }
            }

            // If request to save/update data using another tenantId then reject request
            const payloadMethods = [ERequestMethod.POST, ERequestMethod.PUT, ERequestMethod.PATH];
            if (payloadMethods.includes(method)) {
                const body: any = request.body;
                let bodyTenantId: string = '';

                if ('tenantId' in body) {
                    bodyTenantId = body['tenantId'];
                } else if ('tenant' in body) {
                    bodyTenantId = body['tenant']['id'];
                }

                isAuthorized = currentTenantId === bodyTenantId;
            }
        }

        if (!isAuthorized) {
            console.log('Guard TenantBase: Unauthorized access blocked. TenantId:', headerTenantId);
        } else {
            console.log('Guard TenantBase: Access Allowed. TenantId:', headerTenantId);
        }

        return isAuthorized;
    }
}
