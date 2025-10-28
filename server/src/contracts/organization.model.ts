import { IBasePerTenantEntityModel } from "./base-entity.model";

export interface IOrganization extends IBasePerTenantEntityModel {
    name: string;
    is_default: boolean;
}
