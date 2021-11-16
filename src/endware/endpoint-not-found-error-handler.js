// @ts-check

/**@type {import('express').RequestHandler} */
function endpointNotFoundErrorHandler (req, res, next) {
  if (!res.locals.data) {
    console.warn(`${req.header('method')}: ${req.originalUrl} not found`);
    
    res.statusCode = 404;
    res.locals.data = {
      success: false,
      data: null,
      error: ['E_ENDPOINT_NOT_FOUND']
    }
    return next();
  }
}
module.exports = {
  endpointNotFoundErrorHandler
}