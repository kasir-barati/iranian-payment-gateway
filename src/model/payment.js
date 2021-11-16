// @ts-check
const {
  Model,
  DataTypes,
  Sequelize,
} = require('sequelize');

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

/**
 *
 * @param {Sequelize} sequelize
 */
function initModel(sequelize) {
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
        type: DataTypes.ENUM(
          ...Object.values(paymentStates),
        ),
        defaultValue: paymentStates.authorized,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );
}

module.exports = {
  Payment,
  initModel,
};
