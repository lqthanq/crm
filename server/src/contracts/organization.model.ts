import { IBasePerTenantEntityModel } from './base-entity.model';

export interface IOrganization extends IBasePerTenantEntityModel {
    name: string;
    isDefault: boolean;
}

export interface IOrganizationCreateInput {
    name: string;
    isDefault?: boolean;
}
