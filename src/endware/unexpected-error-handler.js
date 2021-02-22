// @ts-check

/**@type {import('express').ErrorRequestHandler} */
function unexpectedErrorHandler (error, req, res, next) {
  if (error && !res.locals.data) {
    console.error(error);
    
    res.statusCode = 500;
    res.json({
      success: false,
      data: null,
      error: ['E_SERVER'],
    });
  }
  next();
}

module.exports = {
  unexpectedErrorHandler
}