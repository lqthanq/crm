import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';

export interface IEmailTemplate extends IBasePerTenantAndOrganizationEntityModel {
    name: string;
    mjml: string;
    hbs: string;
    languageCode: string;
    title?: string;
}

export enum EEmailTemplate {
    PASSWORD_LESS_AUTHENTICATION = 'password-less-authentication',

    EMAIL_VERIFICATION = 'email-verification',
    WELCOME_USER = 'welcome-user',
}
