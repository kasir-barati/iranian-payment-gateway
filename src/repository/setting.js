// @ts-check
const { Setting } = require('../model/setting');

/**
 *
 * @param {string} id setting id
 * @returns {Promise<Setting | null>}
 */
function fetchSettingByPk(id) {
  return Setting.findByPk(id);
}

/**
 *
 * @param {string} group group name
 * @returns {Promise<Setting[] | null>}
 */
function fetchSettingsByGroup(group) {
  return Setting.findAll({
    where: {
      [Setting.col.group]: group,
    },
  });
}

/**
 *
 * @param {object} page
 * @param {number} page.limit
 * @param {number} page.offset
 * @returns {Promise<Setting[] | null>}
 */
function fetchSettings(page) {
  return Setting.findAll({
    limit: page.limit,
    offset: page.offset,
  });
}

/**
 *
 * @param {string} id
 * @param {object} fields
 * @param {string} fields.value
 * @returns {Promise<[number]>}
 */
function updateSettingByPk(id, fields) {
  // @ts-ignore
  return Setting.update(
    {
      [Setting.col.value]: fields.value,
    },
    {
      where: {
        [Setting.col.id]: id,
      },
    },
  );
}

module.exports = {
  fetchSettings,
  fetchSettingByPk,
  updateSettingByPk,
  fetchSettingsByGroup,
};
