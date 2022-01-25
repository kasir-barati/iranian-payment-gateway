import { config as databaseConfigs } from './database.config';
import { config as expressAppConfigs } from './express-app.config';

export const configs = {
    databaseConfigs: {
        connectionString: `${databaseConfigs.dbDialect}://${databaseConfigs.dbUser}:${databaseConfigs.dbPassword}@${databaseConfigs.dbHost}:${databaseConfigs.dbPort}/${databaseConfigs.dbName}`,
        dialect: databaseConfigs.dbDialect,
        retry: databaseConfigs.retry,
    },
    expressAppConfigs,
};
