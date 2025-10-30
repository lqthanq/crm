import { IBasePerTenantEntityModel } from './base-entity.model';
import { ELanguages } from './language.model';

export interface IUser extends IBasePerTenantEntityModel {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;

    timezone?: string;

    hash?: string;
    preferredLanguage?: ELanguages;

    emailVerifiedAt?: Date;

    code?: string;
    codeExpireAt?: Date;

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

export interface IVerificationTokenPayload extends IUserEmailInput {
    id: string;
}

export interface IUserCreateInput {
    firstName?: string;
    lastName?: string;
    email?: string;
}
