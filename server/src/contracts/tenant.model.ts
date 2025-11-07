import { IBaseEntityModel } from './base-entity.model';

export interface ITenant extends IBaseEntityModel {
    name?: string;
    logo?: string;
    standardWorkHoursPerDay?: number;
}

export interface ITenantUpdateInput {
    name: string;
}

export interface ITenantCreateInput extends ITenantUpdateInput {}
