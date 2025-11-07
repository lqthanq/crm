import { IBasePerTenantEntityModel } from './base-entity.model';
import { ELanguages } from './language.model';
import { IRole } from './role.model';

export interface IUser extends IBasePerTenantEntityModel {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;

    timezone?: string;
    role?: IRole;
    roleId?: IRole['id'];

    hash?: string;
    preferredLanguage?: ELanguages;

    code?: string;
    codeExpireAt?: Date;
    emailVerifiedAt?: Date;
    lastLoginAt?: Date;
    isEmailVerified?: boolean;
    emailToken?: string;
}

export interface IUserRegistrationInput {
    user: IUser;
    password?: string;
    confirmPassword?: string;
    originalUrl?: string;
}

export interface IUserEmailInput {
    email: string;
}

export interface IUserPasswordInput {
    password: string;
}

export interface IVerificationTokenPayload extends IUserEmailInput {
    id: string;
}

export interface IUserLoginInput extends IUserEmailInput, IUserPasswordInput {}

export interface IUserCreateInput {
    firstName?: string;
    lastName?: string;
    email?: string;

    role?: IRole;
    roleId?: string;
}

export interface IAuthResponse {
    user: IUser;
    token: string;
    refresh_token?: string;
}
