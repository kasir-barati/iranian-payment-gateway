// @ts-check
const { EventEmitter } = require('events');

module.exports = {
  settingEventEmitter: new EventEmitter(),
  settingEventsName: {
    settingValueUpdated: 'setting-value-updated',
  },
};
