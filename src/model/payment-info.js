// @ts-check
const {
  Model,
  DataTypes,
  Sequelize,
} = require('sequelize');

const { Payment } = require('./payment');
class PaymentInfo extends Model {
  static col = {
    paymentId: 'paymentId',
    userIp: 'userIp',
    paymentMethodId: 'paymentMethodId',
    authorizeResponse: 'authorizeResponse',
    verifyResponse: 'verifyResponse',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  };

  static alias = {
    paymentInfoBelongsToPaymentMethod:
      'paymentInfoBelongsToPaymentMethod',
    paymentInfoBelongsToPayment:
      'paymentInfoBelongsToPayment',
  };
}

/**
 *
 * @param {Sequelize} sequelize
 */
function initModel(sequelize) {
  PaymentInfo.init(
    {
      [PaymentInfo.col.paymentId]: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      [PaymentInfo.col.paymentMethodId]: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      [PaymentInfo.col.userIp]: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      [PaymentInfo.col.authorizeResponse]: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      [PaymentInfo.col.verifyResponse]: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  Payment.hasOne(PaymentInfo, {
    as: Payment.alias.paymentHasOnePaymentInfo,
    foreignKey: PaymentInfo.col.paymentId,
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  PaymentInfo.belongsTo(Payment, {
    as: PaymentInfo.alias.paymentInfoBelongsToPayment,
    foreignKey: PaymentInfo.col.paymentId,
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}

module.exports = {
  initModel,
  PaymentInfo,
};
