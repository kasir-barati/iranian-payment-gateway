// @ts-check
const router = require('express').Router();

const paymentControllers = require('../controller/payment');
const paymentValidators = require('../validator/payment');
const { validate } = require('../middleware/validate');

router
  .route('/payments/send-payment-request')
  .post(
    ...paymentValidators.sendPaymentRequest,
    validate,
    paymentControllers.sendPaymentRequest,
  );

router.route('/payments/verify-payment').post();

module.exports = router;
