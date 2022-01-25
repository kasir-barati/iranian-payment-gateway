import {
    Sequelize,
    ConnectionError,
    ConnectionRefusedError,
    InvalidConnectionError,
    ConnectionTimedOutError,
} from 'sequelize';

import { configs } from '../configs/factory';
import { ErrorCode } from '../contracts/error-codes.contract';

const sequelize = new Sequelize(
    configs.databaseConfigs.connectionString,
    {
        dialect: configs.databaseConfigs.dialect,
        retry: {
            match: [
                ConnectionError,
                ConnectionRefusedError,
                InvalidConnectionError,
                ConnectionTimedOutError,
            ],
            max: configs.databaseConfigs.retry,
        },
    },
);

export async function authenticate() {
    await sequelize.authenticate().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export function getSequelizeInstance(): Sequelize {
    if (sequelize) {
        return sequelize;
    }

    const error = new Error('sequelize instance is null');

    error.name = ErrorCode.E_NULL_SEQUELIZE_INSTANCE;
    throw error;
}
