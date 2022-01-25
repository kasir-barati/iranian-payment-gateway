// @ts-check

class ErrorResponse extends Error {
    /**
     * @param {Error} error
     * @param {string} errorCode
     * @param {number} statusCode
     */
    constructor(error = undefined, errorCode, statusCode) {
        super(error?.message);
        this.name = error.name;
        this.stack = error.stack;
        this.errorCode = errorCode;
        this.message = error.message;
        this.statusCode = statusCode;
    }
}

class ValidatorError extends ErrorResponse {
    /**@param {string[]} errorsCode */
    constructor(errorsCode) {
        let error = new Error(
            'Validator middleware throw error',
        );

        error.name = 'ValidationError';
        super(error, 'E_VAL', 422);

        this.errorsCode = errorsCode;
    }
}

module.exports = {
    ErrorResponse,
    ValidatorError,
};
