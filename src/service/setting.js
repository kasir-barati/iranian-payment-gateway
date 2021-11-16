// @ts-check
const { Setting } = require('../model/setting');

const settingRepository = require('../repository/setting');

const {
  WrongSettingId,
} = require('../component/custom-express-errors');

const DEFAULT_SETTING_LIMITATION_PER_PAGE = 10;
const DEFAULT_SETTING_OFFSET_PER_PAGE = 1;

/**
 *
 * @param {object} [page]
 * @param {number} page.limit
 * @param {number} page.offset
 * @param {object} filter
 * @param {string} filter.group
 * @returns {Promise<object, Setting[]>} {nextPage, settings}
 */
async function getSettings(filter, page) {
  let settings, nextPage;
  if (filter.group) {
    settings = settingRepository.fetchSettingsByGroup(
      filter.group,
    );
    nextPage = {
      limit: DEFAULT_SETTING_LIMITATION_PER_PAGE,
      offset: DEFAULT_SETTING_OFFSET_PER_PAGE,
    };
  } else {
    settings = settingRepository.fetchSettings(page);
    nextPage = {
      limit:
        page?.limit ?? DEFAULT_SETTING_LIMITATION_PER_PAGE,
      offset: page.offset
        ? page.offset + page.limit
        : DEFAULT_SETTING_OFFSET_PER_PAGE,
    };
  }
  return {
    nextPage,
    settings: await settings,
  };
}

/**
 *
 * @param {string} id setting id
 * @param {string} newValue setting new value
 */
async function updateSetting(id, newValue) {
  let updatedSetting = await settingRepository.updateSettingByPk(
    id,
    {
      value: newValue,
    },
  );

  if (updatedSetting[0] === 0) {
    throw new WrongSettingId();
  }
}

/**
 *
 * @param {string} id setting id
 * @returns {Promise<Setting>}
 */
async function getSetting(id) {
  let setting = await settingRepository.fetchSettingByPk(
    id,
  );

  if (setting === null) {
    throw new WrongSettingId();
  }
  return setting;
}

module.exports = {
  getSetting,
  getSettings,
  updateSetting,
};
