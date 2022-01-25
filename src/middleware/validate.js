// @ts-check
const {
    ValidatorError,
} = require('../util/error-response');

/**@type {import('express').RequestHandler} */
function validate(req, res, next) {
    let errors = res.locals?.errors ?? null;

    if (errors?.length > 0) {
        return next(new ValidatorError(errors));
    }

    next();
}

module.exports = {
    validate,
};
