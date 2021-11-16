// @ts-check
/**@type {import('express').RequestHandler} */
async function sendPaymentRequest(req, res, next) {
  const { orderId, amount } = req.body;
  // axios call
}

module.exports = {
  sendPaymentRequest
};