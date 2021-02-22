// @ts-check

/**@type {import('express').RequestHandler} */
function sendResponse(req, res, next) {
  if (!res.statusCode) {
    res.statusCode = 200;
  }
  res.json(res.locals.data);
};

module.exports = {
  sendResponse, 
};