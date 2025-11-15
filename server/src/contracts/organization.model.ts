import { IBasePerTenantEntityModel } from './base-entity.model';
import { ECurrencies } from './currency.model';

export interface IOrganization extends IBasePerTenantEntityModel {
    name: string;
    isDefault: boolean;

    totalEmployees: number;

    currency: string;

    invitesAllowed?: boolean;
}

export interface IOrganizationCreateInput {
    name: string;
    isDefault?: boolean;

    totalEmployees?: number;

    currency: ECurrencies;

    invitesAllowed?: boolean;
}
