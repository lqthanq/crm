import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IMemberEntityBased } from './employee.model';
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
}

export interface IOrganizationTeam extends IBaseTeamProperties, ITeamAssociations {}

export interface IOrganizationTeamCreateInput extends IBaseTeamProperties, IMemberEntityBased {}
