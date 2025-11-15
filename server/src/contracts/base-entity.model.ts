import { IOrganization } from './organization.model';
import { ITenant } from './tenant.model';
import { IUser } from './user.model';

export type ID = string;

export interface IBaseRelationsEntityModel {
    relations?: string[];
}

export interface IBaseSoftDeleteEntityModel {
    deletedAt?: Date;
}

export interface IBaseEntityActionByUserModel {
    createdByUuser?: IUser;
    createdByUserId?: ID;

    updatedByUser?: IUser;
    updateByUserId?: ID;

    deletedByUser?: IUser;
    deletedByUserId?: ID;
}

export interface IBaseEntityModel extends IBaseEntityActionByUserModel, IBaseSoftDeleteEntityModel {
    id?: ID;

    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    isActive?: boolean;
    isArchived?: boolean;
    archivedAt?: Date;
}

export interface IBasePerTenantEntityModel extends IBaseEntityModel {
    tenantId?: ID;
    tenant?: ITenant;
}

export interface IBasePerTenantAndOrganizationEntityModel extends IBasePerTenantEntityModel {
    organizationId?: ID;
    organization?: IOrganization;
}

export interface IBasePerTenantEntityMutationInput extends IBaseEntityModel {
    tenantId?: ID;
    tenant?: Partial<ITenant>;
}

export interface IBasePerTenantAndOrganizationEntityMutationInput extends Partial<IBasePerTenantEntityMutationInput> {
    organizationId?: ID;
    organization?: Partial<IOrganization>;
}
