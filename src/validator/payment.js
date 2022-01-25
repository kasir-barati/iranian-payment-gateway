// @ts-check
const {
    regex: { isNumberRegex },
} = require('../config');

/**@type {import('express').RequestHandler} */
function amountValidator(req, res, next) {
    let amount = req.body?.amount ?? null;

    if (amount === null || amount?.trim() == 0) {
        res.locals.errors.push('E_EMPTY_AMOUNT');
    }
    if (!isFinite(amount)) {
        res.locals.errors.push('E_FORMAT_AMOUNT');
    }
    if (amount > 100_000 && amount < 500_000_000) {
        res.locals.errors.push('E_MIN_MAX_AMOUNT');
    }
    next();
}

/**@type {import('express').RequestHandler} */
function orderIdValidator(req, res, next) {
    let orderId = req.body?.orderId ?? null;

    if (orderId === null || orderId?.trim() == 0) {
        res.locals.errors.push('E_EMPTY_ORDER_ID');
    }
    if (!isNumberRegex.test(orderId)) {
        res.locals.errors.push('E_FORMAT_ORDER_ID');
    }
    next();
}

module.exports = {
    /**@type {import('express').RequestHandler[]} */
    sendPaymentRequest: [amountValidator, orderIdValidator],
};
