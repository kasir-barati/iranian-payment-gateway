// @ts-check
const { ErrorResponse } = require('../util/error-response');

export class WrongSettingId extends ErrorResponse {
    constructor() {
        let error = new Error('Wrong settingId recieved');

        super(error, 'E_WRONG_SETTING_ID', 404);
    }
}
