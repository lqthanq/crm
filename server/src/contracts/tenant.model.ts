import { IBaseEntityModel } from './base-entity.model';

export interface ITenant extends IBaseEntityModel {
    name?: string;
    logo?: string;
    standardWorkHoursPerDay?: number;
}
