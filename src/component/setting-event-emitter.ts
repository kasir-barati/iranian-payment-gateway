// @ts-check
const { EventEmitter } = require('events');

export const a = {
    settingEventEmitter: new EventEmitter(),
    settingEventsName: {
        settingValueUpdated: 'setting-value-updated',
    },
};
