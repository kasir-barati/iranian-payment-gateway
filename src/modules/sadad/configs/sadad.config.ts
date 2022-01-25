import { ErrorCode } from '../../../contracts/error-codes.contract';

export const config = {
    authoritySeed: '123456789ACDFGHJKLPQRSTUVWXYZ',
    authorityLength: Number(
        process.env?.AUTHORITY_LENGTH ?? '10',
    ),
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
