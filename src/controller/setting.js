// @ts-check
const {
    settingEventsName,
    settingEventEmitter,
} = require('../component/setting-event-emitter');
const settingService = require('../service/setting');

/**@type {import('express').RequestHandler} */
async function getSettings(req, res, next) {
    let page = JSON.parse(String(req.query?.page ?? null));
    let filter = JSON.parse(
        String(req.query?.filter ?? null),
    );

    let { nextPage, settings } =
        await settingService.getSettings(filter, page);

    res.locals.data = {
        success: true,
        data: settings,
        // FIXME: page.limit must send with every request
        // Or the repositry should be more smart and return page
        // Or the service should tell the repository about it
        // Imagine that front does not send the page and in the repositry
        // we use default values, But Service does not know anything
        page: nextPage,
        error: null,
    };
    next();
}

/**@type {import('express').RequestHandler} */
async function updateSetting(req, res, next) {
    let { settingId } = req.params;
    let newValue = req.body.value;

    await settingService.updateSetting(settingId, newValue);
    settingEventEmitter.emit(
        settingEventsName.settingValueUpdated,
        {
            settingId,
        },
    );
    res.locals.data = {
        success: true,
        data: null,
        error: null,
    };
    next();
}

/**@type {import('express').RequestHandler} */
async function getSetting(req, res, next) {
    let { settingId } = req.params;

    let setting = await settingService.getSetting(
        settingId,
    );

    res.locals.data = {
        success: true,
        data: setting,
        error: null,
    };
    next();
}

module.exports = {
    // Or the service should tell the repository about it
    getSetting,
    getSettings,
    updateSetting,
};
