import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';

export interface IEmailTemplate extends IBasePerTenantAndOrganizationEntityModel {
    name: string;
    mjml: string;
    hbs: string;
    language_code: string;
    title?: string;
}

export enum EmailTemplateEnum {
    EMAIL_VERIFICATION = 'email-verification',
    WELCOME_USER = 'welcome-user',
}
