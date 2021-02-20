//@ts-check
const express = require('express');

const { appHost, appPort } = require('./config');

const app = express();

const { initializeDatabase } = require('./init');
const { seedDatabase } = require('./post-init');

initializeDatabase()
  .then(() => {
    return seedDatabase();
  })
  .then(() => {
    app.listen(appPort, appHost, () => {
      console.log(
        `Web API is up and running on ${appPort}`,
      );
    });
  })
  .catch(console.error);
