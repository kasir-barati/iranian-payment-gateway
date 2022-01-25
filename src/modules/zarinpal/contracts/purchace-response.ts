const purchaseResCode = require('./purchase-response-codes.contract');

/**
 *
 * @param {number} resCode
 * @returns {boolean | null} determine payment request is valid or not
 */
function purchaseResponse(resCode) {
    let result = null;

    switch (resCode) {
        case purchaseResCode.successful:
            result = true;
            break;
        case purchaseResCode.unsuccessful:
            result = false;
            break;
    }

    return result;
}
