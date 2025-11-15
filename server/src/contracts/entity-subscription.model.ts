import { IBasePerEntityType, OmitFields } from './base-entity.model';
import { IEmployeeEntityInput } from './employee.model';

export interface IEntitySubscription extends IBasePerEntityType, IEmployeeEntityInput {
    type: EEntitySubscriptionType;
}

export enum EEntitySubscriptionType {
    ASSIGNMENT = 'assignment',
    CREATED_ENTITY = 'created-entity',
}

export interface IEntitySubscriptionCreateInput extends OmitFields<IEntitySubscription> {}
