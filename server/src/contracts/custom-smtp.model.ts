import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';

export interface ICustomSmtp extends IBasePerTenantAndOrganizationEntityModel {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    is_validate?: boolean;
    from_address?: string;
}

export interface ICustomSmtpCreateInput extends ICustomSmtp {}

export interface IVerifySMTPTransport extends Omit<ICustomSmtpCreateInput, 'is_validate'> {}
