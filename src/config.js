// @ts-check

const config = {
  dbName: process.env.POSTGRES_DB,
  dbUser: process.env.POSTGRES_USER,
  dbPort: Number(process.env.POSTGRES_PORT),
  dbHost: process.env.POSTGRES_HOST,
  dbPassword: process.env.POSTGRES_PASSWORD,
  sequelizeDialect: process.env.SEQUELIZE_DIALECT,
  appPort: Number(process.env.APP_PORT),
  appHost: process.env.APP_HOST,
};

if (
  config.dbName === undefined ||
  config.dbUser === undefined ||
  config.dbPort === undefined ||
  config.dbHost === undefined ||
  config.dbPassword === undefined ||
  config.sequelizeDialect === undefined ||
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
