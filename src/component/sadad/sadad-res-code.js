// @ts-check
const purchaseResCode = require('./purchase-res-code.json');
const authorizeResCode = require('./payment-request-res-code.json');

// TODO: throw custom error with the predefined message
/**
 *
 * @param {number} resCode
 * @returns {boolean | null} determine payment request is valid or not
 */
function authorizeResponse(resCode) {
  let result = null;

  switch (resCode) {
    case authorizeResCode.successful:
      result = true;
      break;
    case authorizeResCode['Access failed']:
    case authorizeResCode['Connection failed']:
    case authorizeResCode[
      'Customer IP is in not in the predefined IP range'
    ]:
    case authorizeResCode[
      'Customer have no more time to pay'
    ]:
    case authorizeResCode[
      'Domain address is not in the predefined range'
    ]:
    case authorizeResCode[
      'Duplicated request - Duplicated OrderId'
    ]:
    case authorizeResCode[
      'Extra information did not send or it is wrong'
    ]:
    case authorizeResCode[
      'IPG could not create unique key'
    ]:
    case authorizeResCode['IPG inactivated for a while']:
    case authorizeResCode['Inactive merchant']:
    case authorizeResCode[
      'Internet Payment Gateway is out of service'
    ]:
    case authorizeResCode['Invalid Amount']:
    case authorizeResCode[
      'Invalid Cart, please use the supported carts'
    ]:
    case authorizeResCode['Invalid MerchantId']:
    case authorizeResCode['Invalid MerchantId/TerminalId']:
    case authorizeResCode['Invalid MultiplexingData']:
    case authorizeResCode['Invalid OrderId']:
    case authorizeResCode['Invalid ReturnUrl']:
    case authorizeResCode['Invalid SignData']:
    case authorizeResCode['Invalid TerminalId']:
    case authorizeResCode['Invalid Token']:
    case authorizeResCode['Invalid entered data']:
    case authorizeResCode['Invalid merchant']:
    case authorizeResCode['Invalid moohre zamani']:
    case authorizeResCode['Invalid parameter arrangement']:
    case authorizeResCode['Invalid payment parameters']:
    case authorizeResCode['Invalid payment request']:
    case authorizeResCode[
      'Invalid transaction for the terminal'
    ]:
    case authorizeResCode[
      'Payment inactivated because of the site problems'
    ]:
    case authorizeResCode['Receiver is inactive']:
    case authorizeResCode[
      'Sync your server DateTime with the Bank DateTime'
    ]:
    case authorizeResCode['System Error']:
    case authorizeResCode[
      'System could not process well the optional parameters'
    ]:
    case authorizeResCode[
      'System is unavailable for a short time'
    ]:
    case authorizeResCode[
      'System unavailable - Because of the update'
    ]:
    case authorizeResCode[
      'There is no shetab access for this receiver'
    ]:
    case authorizeResCode['Too much transaction amount']:
    case authorizeResCode[
      'Too much transaction amount for this receiver'
    ]:
    case authorizeResCode['Transaction canceled']:
    case authorizeResCode['Transaction failed']:
    case authorizeResCode['Try agian']:
    case authorizeResCode['Unknown Error']:
    case authorizeResCode["Wrong receiver's IP"]:
    case authorizeResCode["Wrong receiver's MerchantId"]:
    case authorizeResCode[
      "Wrong receiver's info - Wrong Datetime or TerminalKey"
    ]:
      result = false;
      break;
  }

  return result;
}

/**
 *
 * @param {number} resCode
 * @returns {boolean | null} determine payment request is valid or not
 */
function purchaseResponse(resCode) {
  let result = null;

  switch (resCode) {
    case purchaseResCode.successfull:
      result = true;
      break;
    case purchaseResCode.unsuccessfull:
      result = false;
      break;
  }

  return result;
}

module.exports = {
  purchaseResponse,
  authorizeResponse,
};
