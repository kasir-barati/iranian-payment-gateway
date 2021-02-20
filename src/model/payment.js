// @ts-check
const { Model, DataTypes } = require('sequelize');

const { getSequelizeInstance } = require('./sequelize');
const paymentStates = require('../component/payment-state.json');

class Payment extends Model {
  static col = {
    id: 'id',
    paidAt: 'paidAt',
    amount: 'amount',
    state: 'state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  };

  static alias = {
    paymentHasOnePaymentInfo: 'paymentHasOnePaymentInfo',
  };
}

Payment.init(
  {
    [Payment.col.id]: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    [Payment.col.paidAt]: {
      type: DataTypes.DATE,
    },
    [Payment.col.amount]: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    [Payment.col.state]: {
      type: DataTypes.ENUM(...Object.values(paymentStates)),
      defaultValue: paymentStates.authorized,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: getSequelizeInstance(),
  },
);

module.exports = Payment;
