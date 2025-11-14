import { EPermissions } from 'src/contracts';
import {
    SENSITIVE_RELATIONS_KEY,
    SENSITIVE_RELATIONS_ROOT_KEY,
    SensitiveRelationConfig,
} from '../decorators/sensitive-relations.decorator';
import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RequestContext } from '../context';

function isValidPermission(value: any): value is EPermissions {
    return typeof value === 'string' && Object.values(EPermissions).includes(value as EPermissions);
}

/**
 * Returns the required permission for a given relation path by traversing the config tree.
 */
function getRequiredPermissionForRelation(config: SensitiveRelationConfig, relationPath: string): EPermissions | null {
    const pathParts = relationPath.split('.');
    let current: SensitiveRelationConfig | EPermissions | null = config;

    for (const part of pathParts) {
        if (!current || typeof current !== 'object') return null;

        const value = current[part];
        if (typeof value === 'object' && value !== null) {
            if ('_self' in value && value._self) {
                return value._self as EPermissions;
            } else if (isValidPermission(value)) {
                return value;
            }

            return null;
        }
    }

    return null;
}

/**
 * Interceptor to protect sensitive entity relations based on user permissions.
 */
@Injectable()
export class SensitiveRelationsInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const handler = context.getHandler();
        const controller = context.getClass();

        const config: SensitiveRelationConfig =
            this.reflector.get(SENSITIVE_RELATIONS_KEY, handler) ||
            this.reflector.get(SENSITIVE_RELATIONS_KEY, controller);

        const rootKey: string | undefined =
            this.reflector.get(SENSITIVE_RELATIONS_ROOT_KEY, handler) ||
            this.reflector.get(SENSITIVE_RELATIONS_ROOT_KEY, controller);

        if (!config) {
            return next.handle();
        }

        // Use the root if provided
        let configToUse: SensitiveRelationConfig = config;
        if (rootKey) {
            const maybeSubConfig = config[rootKey];

            if (maybeSubConfig && typeof maybeSubConfig === 'object') {
                configToUse = maybeSubConfig;
            }
        }

        // Extract requested relations from the query or body
        const request = context.switchToHttp().getRequest();
        let relations = request.query?.relations || request.body?.relations || [];

        // Sanitize relations input
        if (typeof relations === 'string') {
            relations = relations.trim();
        }

        // Support both array and comma-separated string
        const relationsArray = Array.isArray(relations)
            ? relations
            : typeof relations === 'string'
              ? relations.split(',')
              : [];

        // Filter out invalid relations
        const validRelations = relationsArray
            .map((rel) => (typeof rel === 'string' ? rel.trim() : ''))
            .filter((rel) => rel.length > 0);

        for (const rel of validRelations) {
            let requiredPermission: EPermissions | null = null;
            if (rootKey) {
                // If relation starts with rootKey followed by a dot, remove the prefix for sub-config lookup
                let relationToCheck = rel;
                const rootKeyPrefix = `${rootKey}.`;

                if (rel.startsWith(rootKeyPrefix)) {
                    relationToCheck = rel.slice(rootKeyPrefix.length);

                    // Trim any remaining leading dots from malformed input
                    relationToCheck = relationToCheck.replace(/^\.+/, '');
                }

                requiredPermission = getRequiredPermissionForRelation(configToUse, relationToCheck);
            } else {
                requiredPermission = getRequiredPermissionForRelation(configToUse, rel);
            }

            if (requiredPermission) {
                if (!RequestContext.hasPermission(requiredPermission)) {
                    throw new ForbiddenException(
                        `Access to the sensitive relation '${rel}' is forbidden. Required permission: '${requiredPermission}'.`,
                    );
                }
            }
        }

        return next.handle();
    }
}
