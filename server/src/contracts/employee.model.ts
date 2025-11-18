import {
    IBasePerTenantAndOrganizationEntityModel,
    IBasePerTenantAndOrganizationEntityMutationInput,
    ID,
} from './base-entity.model';
import { IOrganizationProject } from './organization-project.model';
import { IUser } from './user.model';

export interface IEmployee extends IBasePerTenantAndOrganizationEntityModel {
    [x: string]: any;
    endWork?: Date;
    startedWorkOn?: Date;
    user: IUser;
    userId: ID;

    projects?: IOrganizationProject[];

    fullName?: string;
    profile_link?: string;
    isTrackingEnabled: boolean;
}

export interface IEmployeeCreateInput extends IBasePerTenantAndOrganizationEntityMutationInput {
    user?: IUser;
    userId?: ID;
    startedWorkOn?: Date;
}

export interface IEmployeeEntityInput {
    employeeId?: ID;
    employee?: IEmployee;
}

export interface IMemberEntityBased {
    memberIds?: ID[];
    managerIds?: ID[];
}
