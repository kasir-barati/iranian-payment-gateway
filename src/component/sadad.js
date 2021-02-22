// @ts-check
const { default: Axios } = require('axios');

const { Setting } = require('../model/setting');
const settingRepository = require('../repository/setting');

const {
  EmptySadadSettings,
  SadadSettingDeleted,
} = require('./system-errors');

const {
  paymentGateway: { sadad },
} = require('../config');
const {
  settingEventsName,
  settingEventEmitter,
} = require('./setting-event-emitter');

// Request/PaymentRequest

let paymentGatewayInfo = {
  MerchantId: '',
  TerminalId: '',
  TerminalKey: '',
};

let axios = Axios.create({
  baseURL: '‫‪https://sadad.shaparak.ir/api/v0/',
  headers: {
    'content-type': 'application/json',
  },
});

async function initializeSadadPaymentGatewayInfo() {
  let settings = await settingRepository.fetchSettingsByGroup(
    sadad.group,
  );

  if (settings.length === 0) {
    let error = new Error(
      'During initialization something wents wrong. Sadad settings is empty',
    );

    error.name = 'E_EMPTY_SADAD_SETTINGS';
    throw new EmptySadadSettings(error);
  }

  settings.forEach(syncPaymentGatewayInfo);
}

function defineSadadSettingListenner() {
  settingEventEmitter.on(
    settingEventsName.settingValueUpdated,
    async ({ settingId }) => {
      let setting = await settingRepository.fetchSettingByPk(
        settingId,
      );

      if (!setting) {
        let error = new Error(
          `${settingId} does not exists in the settings table that is required fo the sadad component`,
        );

        error.name = 'E_WRONG_SETTING_ID';
        throw new SadadSettingDeleted(error);
      } else if (
        setting[Setting.col.group] === sadad.group
      ) {
        syncPaymentGatewayInfo(setting);
      }
    },
  );
}

/**
 *
 * @param {object} body
 * @param {number} body.amount
 * @param {number} body.orderId
 */
async function sendPaymentRequest(body) {
  let sadadConfig = await settingRepository.fetchSettingsByGroup(
    'sadad',
  );
}

/**
 *
 * @param {Setting} setting
 */
function syncPaymentGatewayInfo(setting) {
  switch (setting[Setting.col.key]) {
    case sadad.keys.MerchentId:
      paymentGatewayInfo.MerchantId =
        setting[Setting.col.value];
      break;
    case sadad.keys.TerminalId:
      paymentGatewayInfo.TerminalId =
        setting[Setting.col.value];
      break;
    case sadad.keys.TerminalKey:
      paymentGatewayInfo.TerminalKey =
        setting[Setting.col.value];
      break;
  }
}

module.exports = {
  sendPaymentRequest,
  defineSadadSettingListenner,
  initializeSadadPaymentGatewayInfo,
};
