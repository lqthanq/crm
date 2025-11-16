import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';
import { IMemberEntityBased } from './employee.model';

export interface IOrganizationProjectBase extends IBasePerTenantAndOrganizationEntityModel {
    name?: string;

    public?: boolean;

    membersCount?: number;
}

export interface IOrganizationProject extends IOrganizationProjectBase {
    name: string;
}

export interface IOrganizationProjectCreateInput extends IOrganizationProjectBase, IMemberEntityBased {}
