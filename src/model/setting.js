// @ts-check
const {
  Model,
  DataTypes,
  Sequelize,
} = require('sequelize');

class Setting extends Model {
  static col = {
    id: 'id',
    key: 'key',
    group: 'group',
    value: 'value',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  };
}

/**
 *
 * @param {Sequelize} sequelize
 */
function initModel(sequelize) {
  Setting.init(
    {
      [Setting.col.id]: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      [Setting.col.group]: {
        type: DataTypes.STRING,
      },
      [Setting.col.key]: {
        unique: true,
        type: DataTypes.STRING,
      },
      [Setting.col.value]: {
        type: DataTypes.STRING,
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
  Setting,
  initModel,
};
