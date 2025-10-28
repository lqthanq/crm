import { IBasePerTenantEntityModel } from "./base-entity.model";

export interface IUser extends IBasePerTenantEntityModel {
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;

    timezone?: string;

    hash?: string;
    preferred_language?: string;

    email_verified_at?: Date;
}