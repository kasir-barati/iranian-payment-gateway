// @ts-check

const config = {
  database: {
    dbName: process.env.POSTGRES_DB,
    dbUser: process.env.POSTGRES_USER,
    dbPort: Number(process.env.POSTGRES_PORT),
    dbHost: process.env.POSTGRES_HOST,
    dbPassword: process.env.POSTGRES_PASSWORD,
    sequelizeDialect: process.env.SEQUELIZE_DIALECT,
  },
  appPort: Number(process.env.APP_PORT),
  appHost: process.env.APP_HOST,
  regex: {
    isNumberRegex: /^[0-9]/,
  },
  paymentGateway: {
    sadad: {
      group: 'sadad',
      keys: {
        MerchentId: 'MerchentId',
        TerminalId: 'TerminalId',
        TerminalKey: 'TerminalKey',
      },
    },
  },
};

if (
  config.database.dbName === undefined ||
  config.database.dbUser === undefined ||
  config.database.dbPort === undefined ||
  config.database.dbHost === undefined ||
  config.database.dbPassword === undefined ||
  config.database.sequelizeDialect === undefined ||
  config.appPort === undefined ||
  config.appHost === undefined
) {
  let error = new Error(
    'Environment variable could not resolve successfully',
  );
  error.name = 'E_ENV';
  throw error;
}

module.exports = config;
