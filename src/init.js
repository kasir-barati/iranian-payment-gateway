// @ts-check
const {
  authenticate,
  getSequelizeInstance,
} = require('./model/sequelize');

const settingModel = require('./model/setting');
const paymentModel = require('./model/payment');
const paymentInfoModel = require('./model/payment-info');
const {
  initializeSadadPaymentGatewayInfo,
} = require('./component/sadad');

async function initDatabase() {
  let sequelizeInstance = getSequelizeInstance();

  await authenticate();

  paymentModel.initModel(sequelizeInstance);
  paymentInfoModel.initModel(sequelizeInstance);
  settingModel.initModel(sequelizeInstance);

  await sequelizeInstance.sync();
}

module.exports = async () => {
  await initDatabase();
  await initializeSadadPaymentGatewayInfo();
};
