import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IManagerAssignable } from './common.model';
import { IEmployeeEntityInput, IMemberEntityBased } from './employee.model';
import { IOrganizationTeam } from './organization-team.model';
import { IRelationalRole } from './role.model';

export interface IOrganizationProjectBase extends IBasePerTenantAndOrganizationEntityModel {
    name?: string;

    members?: IOrganizationProjectEmployee[];
    public?: boolean;
    
    teams?: IOrganizationTeam[];

    membersCount?: number;
}

export interface IOrganizationProject extends IOrganizationProjectBase {
    name: string;
}

export interface IOrganizationProjectCreateInput extends IOrganizationProjectBase, IMemberEntityBased {}

export interface IOrganizationProjectEmployee
    extends IBasePerTenantAndOrganizationEntityModel,
        IEmployeeEntityInput,
        IRelationalRole,
        IManagerAssignable {
    organizationProject: IOrganizationProject;
    organizationProjectId: ID;
}
