// @ts-check
const { Setting } = require('../model/setting');

const {
  paymentGateway: { sadad },
} = require('../config');

const settings = [
  {
    [Setting.col.group]: sadad.group,
    [Setting.col.key]: sadad.keys.MerchentId,
    [Setting.col.value]: '',
  },
  {
    [Setting.col.group]: sadad.group,
    [Setting.col.key]: sadad.keys.TerminalId,
    [Setting.col.value]: '',
  },
  {
    [Setting.col.group]: sadad.group,
    [Setting.col.key]: sadad.keys.TerminalKey,
    [Setting.col.value]: '',
  },
];

function seeder() {
  return Setting.bulkCreate(settings, {
    hooks: true,
    individualHooks: false,
    validate: false,
  });
}

module.exports = {
  seeder,
  dependsOn: [],
  name: Setting.name,
};
