const express = require('express');

const app = express();

const { appHost, appPort } = require('./config');

const { sendResponse } = require('./endware/send-response');
const {
    expectedErrorHandler,
} = require('./endware/expected-error-handler');
const {
    unexpectedErrorHandler,
} = require('./endware/unexpected-error-handler');
const {
    endpointNotFoundErrorHandler,
} = require('./endware/endpoint-not-found-error-handler');

const paymentRouter = require('./router/payment');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(paymentRouter);
app.use(endpointNotFoundErrorHandler);
app.use(sendResponse);

app.use(expectedErrorHandler);
app.use(unexpectedErrorHandler);

function listenExpressApp() {
    app.listen(appPort, appHost, () => {
        console.log(
            `Web API is up and running on ${appPort}`,
        );
    });
}

module.exports = {
    app,
    listenExpressApp,
};
