// @ts-check

class EmptySadadSettings extends Error {
    /**@param {Error} error */
    constructor(error) {
        super(error.message);
        console.error(error);
        process.exit(1);
    }
}

class SadadSettingDeleted extends Error {
    /**@param {Error} error */
    constructor(error) {
        super(error.message);
        console.error(error);
        process.exit(1);
    }
}

module.exports = {
    EmptySadadSettings,
    SadadSettingDeleted,
};
