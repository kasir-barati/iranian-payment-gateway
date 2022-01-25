import { ErrorCode } from '../../../contracts/error-codes.contract';

export const config = {
    merchantId: 'merchantId',
    terminalId: 'TerminalId',
    terminalKey: 'TerminalKey',
};

if (
    config.merchantId === undefined ||
    config.terminalId === undefined ||
    config.terminalKey === undefined
) {
    let error = new Error(
        'Express App Environmental variables could not resolve successfully',
    );
    error.name = ErrorCode.E_ENV;
    throw error;
}
