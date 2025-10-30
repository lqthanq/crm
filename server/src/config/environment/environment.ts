import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    clientBaseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:4200',
    production: false,

    env: {
        LOG_LEVEL: 'debug',
    },

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_TOKEN_EXPIRATION_TIME: parseInt(process.env.JWT_TOKEN_EXPIRATION_TIME!),

    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME!),

    JWT_VERIFICATION_TOKEN_SECRET: process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME,
    JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: parseInt(process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME!),

    USER_PASSWORD_BCRYPT_SALT_ROUNDS: 12,

    smtpConfig: {
        host: process.env.MAIL_HOST!,
        port: parseInt(process.env.MAIL_PORT!, 10),
        secure: process.env.MAIL_PORT === '465' ? true : false,
        auth: {
            user: process.env.MAIL_USERNAME!,
            pass: process.env.MAIL_PASSWORD!,
        },
        fromAddress: process.env.MAIL_FROM_ADDRESS,
    },

    appIntegrationConfig: {
        appName: process.env.APP_NAME || 'CRM',
        appEmailConfirmationUrl: process.env.APP_EMAIL_CONFIRMATION_URL || `${process.env.CLIENT_BASE_URL}/auth/confirm-email`
    }
};
