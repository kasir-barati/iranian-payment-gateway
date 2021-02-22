// @ts-check
// TODO: read seed folder and require all files. then call their seeder based on dependsOn
const setting = require('./seeder/setting');
const { listenExpressApp } = require('./express-app');
const {
  defineSadadSettingListenner,
} = require('./component/sadad');

async function seedDatabase() {
  await setting.seeder();
}

module.exports = async () => {
  await seedDatabase();
  defineSadadSettingListenner();
  listenExpressApp();
};
