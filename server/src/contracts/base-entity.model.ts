import { IOrganization } from "./organization.model";
import { ITenant } from "./tenant.model";
import { IUser } from "./user.model";

export type ID = string;

export interface IBaseRelationsEntityModel {
    relations?: string[];
}

export interface IBaseSoftDeleteEntityModel {
    deleted_at?: Date;
}

export interface IBaseEntityActionByUserModel {
    created_by_user?: IUser;
    created_by_user_id?: ID;

    updated_by_user?: IUser;
    updated_by_user_id?: ID;

    deleted_by_user?: IUser;
    deleted_by_user_id?: ID;
}

export interface IBaseEntityModel extends IBaseEntityActionByUserModel, IBaseSoftDeleteEntityModel {
    id?: ID;

    readonly created_at?: Date;
    readonly updated_at?: Date;

    is_active?: boolean;
    is_archived?: boolean;
    archived_at?: Date;
}

export interface IBasePerTenantEntityModel extends IBaseEntityModel {
    tenant_id?: ID;
    tenant?: ITenant;
}

export interface IBasePerTenantAndOrganizationEntityModel extends IBasePerTenantEntityModel {
    organization_id?: ID;
    organization?: IOrganization;
}
