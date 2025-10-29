import { LoggerOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

const dbSlowQueryLoggingTimeout = process.env.DB_SLOW_QUERY_LOGGING_TIMEOUT
    ? parseInt(process.env.DB_SLOW_QUERY_LOGGING_TIMEOUT)
    : 10000; // 10s default

const dbPoolSize = process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE) : 40;

const dbConnectionTimeout = process.env.DB_CONNECTION_TIMEOUT ? parseInt(process.env.DB_CONNECTION_TIMEOUT) : 5000; // 5s default

const idleTimeoutMillis = process.env.DB_IDLE_TIMEOUT ? parseInt(process.env.DB_IDLE_TIMEOUT) : 10000;

export const typeOrmConnectionConfig: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'root',
    logging: process.env.DB_LOGGING as LoggerOptions,
    logger: 'advanced-console',
    maxQueryExecutionTime: dbSlowQueryLoggingTimeout,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    uuidExtension: 'pgcrypto',

    poolSize: dbPoolSize,
    extra: {
        max: dbPoolSize,
        minConnection: 0,
        maxConnaction: dbPoolSize,
        poolSize: dbPoolSize,
        connectionTimeoutMillis: dbConnectionTimeout,
        idletimeoutMillis: idleTimeoutMillis,
    },
};
