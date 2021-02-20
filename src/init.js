// @ts-check
const {
  authenticate,
  getSequelizeInstance,
} = require('./model/sequelize');

async function initializeDatabase() {
  await authenticate();

  require('./model/payment');
  require('./model/payment-info');

  await getSequelizeInstance().sync();
}

module.exports = {
  initializeDatabase,
};
