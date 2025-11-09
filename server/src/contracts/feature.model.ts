import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';

export interface IFeature extends IBasePerTenantAndOrganizationEntityModel {
    code: EFeatures;
    description: string;
    featureOrganizations?: IFeatureOrganization[];
    link: string;
    name: string;
    status: string;

    isEnabled?: boolean;
    isPaid?: boolean;
    readonly parentId?: string;
    parent?: IFeature;
    children?: IFeature[];
}

export interface IFeatureOrganization extends IBasePerTenantAndOrganizationEntityModel {
    feature: IFeature;
    featureId?: string;
    isEnabled: boolean;
}

export interface IFeatureCreateInput extends IFeature {
    isEnabled: boolean;
}

export enum EFeatures {
    FEATURE_DASHBOARD = 'FEATURE_DASHBOARD',

    FEATURE_PAYMENT = 'FEATURE_PAYMENT',
    
    FEATURE_EMPLOYEES = 'FEATURE_EMPLOYEES',
    
    FEATURE_EMPLOYEE_LEVEL = 'FEATURE_EMPLOYEE_LEVEL',
    FEATURE_EMPLOYEE_POSITION = 'FEATURE_EMPLOYEE_POSITION',
    FEATURE_EMPLOYEE_TIMEOFF = 'FEATURE_EMPLOYEE_TIMEOFF',

    FEATURE_USER = 'FEATURE_USER',
}
