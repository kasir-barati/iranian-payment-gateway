import { ErrorCode } from '../contracts/error-codes.contract';

export const config = {
    appPort: Number(process.env.APP_PORT),
    appHost: process.env.APP_HOST,
    regex: {
        isNumberRegex: /^[0-9]/,
    },
};

if (
    config.appPort === undefined ||
    config.appHost === undefined
) {
    let error = new Error(
        'Express App Environmental variables could not resolve successfully',
    );
    error.name = ErrorCode.E_ENV;
    throw error;
}
