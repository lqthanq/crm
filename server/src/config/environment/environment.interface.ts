import { IAppIntegrationConfig, ISMTPConfig } from 'src/common';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Env {
    LOG_LEVEL: LogLevel;
    [key: string]: string;
}

export interface IEnvironment {
    clientBaseUrl: string;

    production: boolean;
    env?: Env;

    JWT_SECRET?: string;
    JWT_TOKEN_EXPIRATION_TIME?: number;

    JWT_REFRESH_TOKEN_SECRET?: string;
    JWT_REFRESH_TOKEN_EXPIRATION_TIME?: number;

    JWT_VERIFICATION_TOKEN_SECRET?: string;
    JWT_VERIFICATION_TOKEN_EXPIRATION_TIME?: number;

    USER_PASSWORD_BCRYPT_SALT_ROUNDS?: number;

    smtpConfig?: ISMTPConfig;

    /** Email Template Config */
    appIntegrationConfig?: IAppIntegrationConfig
}
