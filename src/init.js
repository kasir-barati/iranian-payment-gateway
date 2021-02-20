// @ts-check
const {
  authenticate,
  getSequelizeInstance,
} = require('./model/sequelize');
const paymentModel = require('./model/payment');
const paymentInfoModel = require('./model/payment-info');

async function initializeDatabase() {
  let sequelizeInstance = await getSequelizeInstance();

  await authenticate();

  paymentModel.initModel(sequelizeInstance);
  paymentInfoModel.initModel(sequelizeInstance);

  sequelizeInstance.sync();
}

module.exports = {
  initializeDatabase,
};
