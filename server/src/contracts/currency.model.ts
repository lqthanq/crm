import { IBaseEntityModel } from './base-entity.model';

export interface ICurrency extends IBaseEntityModel {
    isoCode: string;
    currency: string;
}

export const DEFAULT_CURRENCIES = {
    USD: 'US Dollar',
    VND: 'Vietnamese Dong',
};
