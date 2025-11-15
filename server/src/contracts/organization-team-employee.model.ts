import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';
import { IEmployeeEntityInput } from './employee.model';
import { IRelationalOrganizationTeam } from './organization-team.model';

export interface IBaseOrganizationTeamEmployee
    extends IBasePerTenantAndOrganizationEntityModel,
        IRelationalOrganizationTeam {
    order?: number;
    isTrackingEnabled?: boolean;
}

export interface IOrganizationTeamEmployee extends IBaseOrganizationTeamEmployee, IEmployeeEntityInput {}
