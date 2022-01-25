import { Dialect } from 'sequelize/types';
import { ErrorCode } from '../contracts/error-codes.contract';

interface Config {
    dbName: string;
    dbUser: string;
    dbPort: number;
    dbHost: string;
    dbPassword: string;
    dbDialect: Dialect;
    retry?: number;
}

export const config: Config = {
    dbName: process.env.POSTGRES_DB,
    dbUser: process.env.POSTGRES_USER,
    dbPort: Number(process.env.POSTGRES_PORT),
    dbHost: process.env.POSTGRES_HOST,
    dbPassword: process.env.POSTGRES_PASSWORD,
    dbDialect: process.env.DATABASE_DIALECT as Dialect,
    retry: Number(process.env?.DATABASE_RETRY ?? '10'),
};

if (
    config.dbName === undefined ||
    config.dbUser === undefined ||
    config.dbPort === undefined ||
    config.dbHost === undefined ||
    config.dbPassword === undefined ||
    config.dbDialect === undefined
) {
    const error = new Error(
        'Database Environmental variables could not resolve successfully',
    );
    error.name = ErrorCode.E_ENV;
    throw error;
}
if (
    config.dbDialect !== 'mariadb' &&
    config.dbDialect !== 'mssql' &&
    config.dbDialect !== 'mysql' &&
    config.dbDialect !== 'postgres' &&
    config.dbDialect !== 'sqlite'
) {
    const error = new Error(
        'Database dialect variables is set valid',
    );
    error.name = ErrorCode.E_ENV;
    throw error;
}
