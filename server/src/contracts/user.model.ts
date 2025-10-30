import { IBasePerTenantEntityModel } from './base-entity.model';
import { ELanguages } from './language.model';

export interface IUser extends IBasePerTenantEntityModel {
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;

    timezone?: string;

    hash?: string;
    preferred_language?: ELanguages;

    email_verified_at?: Date;

    code?: string;
    code_expire_at?: Date;

    email_token?: string;
}

export interface IUserRegistrationInput {
    user: IUser;
    password?: string;
    confirm_password?: string;
    original_url?: string;
}

export interface IUserEmailInput {
    email: string;
}

export interface IVerificationTokenPayload extends IUserEmailInput {
    id: string;
}

export interface IUserCreateInput {
    first_name?: string;
    last_name?: string;
    email?: string;
}
