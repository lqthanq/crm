import { IBaseEntityModel } from './base-entity.model';

export interface ITenant extends IBaseEntityModel {
    name?: string;
    logo?: string;
    standard_work_hours_per_day?: number;
}
