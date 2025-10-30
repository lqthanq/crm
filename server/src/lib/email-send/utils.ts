import nodemailer from 'nodemailer';
import { ISMTPConfig } from 'src/common';
import { environment } from 'src/config';
import { IVerifySMTPTransport } from 'src/contracts';

/**
 * Email utils functions.
 */
export class SMTPUtils {
    /** Normalize secure flag by port and explicit configuration */
    public static normalizeSecure(port?: number, secure?: boolean): boolean {
        const p = port ?? 587;
        if (p === 465) return true;
        if (p === 587) return false;

        return !!secure;
    }

    /** Returns the default SMTP transporter configuration based on the environment */
    public static defaultSMTPTransporter(auth: boolean = true): ISMTPConfig {
        const smtpConfig: ISMTPConfig = environment.smtpConfig!;

        const smtp: Partial<ISMTPConfig> = {
            fromAddress: smtpConfig.fromAddress,
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: smtpConfig.secure,
        };

        if (auth) {
            smtp.auth = {
                user: smtpConfig.auth!.user,
                pass: smtpConfig.auth!.pass,
            };
        }

        // Construct and return the SMTP configuration object
        return smtp as ISMTPConfig;
    }

    //
    public static convertSmtpToTransporter(config: ISMTPConfig): IVerifySMTPTransport {
        const normalizedPort = config.port ?? 587;

        const normalizedSecure = SMTPUtils.normalizeSecure(normalizedPort, config.secure);
        const transport: IVerifySMTPTransport = {
            host: config.host,
            port: normalizedPort,
            secure: normalizedSecure,
            username: config.auth?.user!,
            password: config.auth?.pass!,
            fromAddress: config?.fromAddress,
        };

        return transport;
    }

    /**
     * Verifies the configuration of an SMTP transporter.
     */
    public static async verifyTransporter(config: IVerifySMTPTransport): Promise<boolean> {
        try {
            const port = config.port || 587;

            const secure = SMTPUtils.normalizeSecure(port, config.secure);
            const transporter = nodemailer.createTransport({
                from: config.fromAddress,
                host: config.host,
                port,
                secure,
                requireTLS: port === 587 ? true : undefined,
                tls: port === 587 && !secure ? { servername: config.host } : undefined,
                auth: {
                    user: config.username,
                    pass: config.password,
                },
            });

            // Verify the transporter
            return await transporter.verify();
        } catch (error) {
            console.log(`Error while verifying nodemailer transport: %s`, error?.message);
            return false;
        }
    }

    /**
     * Build Nodemailer transport options from ISMTPConfig with proper STARTTLS/TLS semantics
     */
    public static buildTransportFromSMTPConfig(config: ISMTPConfig) {
        const port = config.port ?? 587;
        let secure = SMTPUtils.normalizeSecure(port, config.secure);
        if (port === 587 && secure === true) {
            secure = false;
        }

        return {
            ...config,
            port,
            secure,
            requireTLS: port === 587 ? true : undefined,
            tls: port === 587 && secure === false ? { servername: config.host } : undefined,
        };
    }
}
