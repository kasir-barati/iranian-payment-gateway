//@ts-check
const init = require('./src/init');
const postInit = require('./src/post-init');

init()
  .then(() => postInit())
  .catch(console.error);
