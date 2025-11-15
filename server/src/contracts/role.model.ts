import { IBasePerTenantEntityModel } from './base-entity.model';
import { IRolePermission } from './role-permission.model';

export interface IRoleCreateInput extends IBasePerTenantEntityModel {
    name: string;
}

export interface IRole extends IRoleCreateInput {
    isSystem?: boolean;
    rolePermissions?: IRolePermission[];
}

export enum ERoles {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    DATA_ENTRY = 'DATA_ENTRY',
    INTERVIEWER = 'INTERVIEWER',
}

export const DEFAULT_SYSTEM_ROLES = [ERoles.SUPER_ADMIN, ERoles.SUPER_ADMIN];
