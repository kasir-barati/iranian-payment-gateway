// @ts-check
const router = require('express').Router();

const settingController = require('../controller/setting');

router
    .route('/settings')
    .get(settingController.getSettings);

router
    .route('/settings/id')
    .get(settingController.getSetting)
    .put(settingController.updateSetting);

module.exports = router;
