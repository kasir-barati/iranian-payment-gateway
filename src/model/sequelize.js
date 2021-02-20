// @ts-check
const {
  Sequelize,
  ConnectionError,
  ConnectionRefusedError,
  InvalidConnectionError,
  ConnectionTimedOutError,
} = require('sequelize');

const {
  dbPort,
  dbHost,
  dbName,
  dbUser,
  dbPassword,
  sequelizeDialect,
} = require('../config');

// @ts-ignore
const sequelize = new Sequelize({
  dialect: sequelizeDialect,
  port: dbPort,
  host: dbHost,
  database: dbName,
  username: dbUser,
  password: dbPassword,
  retry: {
    match: [
      ConnectionError,
      ConnectionRefusedError,
      InvalidConnectionError,
      ConnectionTimedOutError,
    ],
    max: 10,
  },
});

async function authenticate() {
  await sequelize.authenticate().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

/**
 * @returns {Sequelize}
 */
function getSequelizeInstance() {
  if (sequelize) {
    return sequelize;
  }

  let error = new Error('sequelize instance is null');
  error.name = 'E_NULL_SEQUELIZE_INSTANCE';
  throw error;
}

module.exports = {
  authenticate,
  getSequelizeInstance,
};
