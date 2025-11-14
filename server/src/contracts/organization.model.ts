import { IBasePerTenantEntityModel } from './base-entity.model';
import { ECurrencies } from './currency.model';

export interface IOrganization extends IBasePerTenantEntityModel {
    name: string;
    isDefault: boolean;

    currency: string;
}

export interface IOrganizationCreateInput {
    name: string;
    isDefault?: boolean;

    currency: ECurrencies;
}
