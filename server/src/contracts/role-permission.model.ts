import { IBasePerTenantEntityModel, ID } from './base-entity.model';
import { IRole } from './role.model';

export interface IRolePermission extends IBasePerTenantEntityModel {
    role: IRole;
    roleId: ID;
    permission: string;
    enabled: boolean;
    description: string;
}

export enum EPermissions {
    ADMIN_DASHBOARD_VIEW = 'ADMIN_DASHBOARD_VIEW',
    TEAM_DASHBOARD = 'TEAM_DASHBOARD',

    ORG_PAYMENT_VIEW = 'ORG_PAYMENT_VIEW',
    ORG_PAYMENT_ADD_EDIT = 'ORG_PAYMENT_ADD_EDIT',

    // Employee CRUD Permissions
    ORG_EMPLOYEES_VIEW = 'ORG_EMPLOYEES_VIEW',

    /** Time Off CRUD Permissions */
    CHANGE_SELECTED_EMPLOYEE = 'CHANGE_SELECTED_EMPLOYEE',

    // Member View Permissions
    ORG_CANDIDATES_INTERVIEW_EDIT = 'ORG_CANDIDATES_INTERVIEW_EDIT',
    ORG_CANDIDATES_INTERVIEW_VIEW = 'ORG_CANDIDATES_INTERVIEW_VIEW',
    ORG_CANDIDATES_DOCUMENTS_VIEW = 'ORG_CANDIDATES_DOCUMENTS_VIEW',

    // Tag Types CURD Permission
    ORG_USERS_VIEW = 'ORG_USERS_VIEW',
    ALL_ORG_VIEW = 'ALL_ORG_VIEW',
    ALL_ORG_EDIT = 'ALL_ORG_EDIT',

    // Viewing & Discovery
    PLUGIN_VIEW = 'PLUGIN_VIEW',
}
