// @ts-check
const {
    ValidatorError,
    ErrorResponse,
} = require('../util/error-response');

/**@type {import('express').ErrorRequestHandler} */
function expectedErrorHandler(error, req, res, next) {
    if (error && error instanceof ValidatorError) {
        console.error(error);

        res.statusCode = error.statusCode;
        res.json({
            success: false,
            data: null,
            error: error.errorsCode,
        });
    } else if (error && error instanceof ErrorResponse) {
        console.error(error);

        res.statusCode = error.statusCode;
        res.json({
            success: false,
            data: null,
            error: error.errorCode,
        });
    }
    next();
}

module.exports = {
    expectedErrorHandler,
};
