import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IMemberEntityBased } from './employee.model';
import { IOrganizationProject, IOrganizationProjectCreateInput } from './organization-project.model';
import { IOrganizationTeamEmployee } from './organization-team-employee.model';

export interface IRelationalOrganizationTeam {
    organizationTeam?: IOrganizationTeam;
    organizationTeamId?: ID;
}

interface IBaseTeamProperties extends IBasePerTenantAndOrganizationEntityModel {
    name: string;
}

interface ITeamAssociations {
    members?: IOrganizationTeamEmployee[];
    managers?: IOrganizationTeamEmployee[];
    projects?: IOrganizationProject[];
}

export interface IOrganizationTeam extends IBaseTeamProperties, ITeamAssociations {}

export interface IOrganizationTeamCreateInput extends IBaseTeamProperties, IMemberEntityBased {
    projects?: IOrganizationProjectCreateInput[];
}
