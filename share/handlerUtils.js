/* Some common functions used by all services */

"use strict";

var fluid = require("infusion"),
    adaptiveContentService = {},
    kettle = require("kettle"),
    ACS = fluid.registerNamespace("ACS");

adaptiveContentService.handlerUtils = fluid.registerNamespace("adaptiveContentService.handlerUtils");

require("./utils");

// Common function for all dictionary endpoints to send success response
adaptiveContentService.handlerUtils.sendSuccessResponse = function (request, version, serviceSource, statusCode, message, jsonResponse, serviceType) {
    request.events.onSuccess.fire({
        version: version,
        service: {
            name: serviceType,
            source: serviceSource
        },
        statusCode: statusCode,
        message: message,
        jsonResponse: jsonResponse
    });
};

// Common function for all dictionary endpoints to send error response
adaptiveContentService.handlerUtils.sendErrorResponse = function (request, version, serviceSource, statusCode, message, serviceType) {
    request.events.onError.fire({
        version: version,
        service: {
            name: serviceType,
            source: serviceSource
        },
        statusCode: statusCode,
        message: message,
        jsonResponse: {}
    });
};

// Check presence of Oxford API keys
adaptiveContentService.handlerUtils.checkOxfordServiceKeys = function () {
    var oxfordAppId = kettle.resolvers.env("OXFORD_APP_ID");
    var oxfordAppKey = kettle.resolvers.env("OXFORD_APP_KEY");

    if (!oxfordAppId) {
        ACS.log("WARNING! Oxford 'App ID' not found. Refer README for instructions to adding it.");
    }

    if (!oxfordAppKey) {
        ACS.log("WARNING! Oxford 'App Key' not found. Refer README for instructions to adding it.");
    }
};

// Check presence of API keys for all the services used for Translation endpoints
adaptiveContentService.handlerUtils.checkTranslationServiceKeys = function () {
    //YANDEX
    var yandexApiKey = kettle.resolvers.env("YANDEX_API_KEY");

    if (!yandexApiKey) {
        ACS.log("WARNING! Yandex 'Api Key' not found. Refer README for instructions to adding it.");
    }

    //GOOGLE
    var googleApiKey = kettle.resolvers.env("GOOGLE_API_KEY");

    if (!googleApiKey) {
        ACS.log("WARNING! Google 'Api Key' not found. Refer README for instructions to adding it.");
    }
};

//function to get the endpoint name from the request url
adaptiveContentService.handlerUtils.getEndpointName = function (url) {
    var endpointNameRegex = /\/\w+\/\w+\/\w+\/\w+\/(\w+)\.*/g, //to extract name of the endpoint from the url
        match = endpointNameRegex.exec(url);

    return match[1];
};

//function to get the service name from the request url TODO: test
adaptiveContentService.handlerUtils.getServiceName = function (url) {
    var serviceNameRegex = /\/\w+\/\w+\/(\w+)\.*/g, //to extract name of the service from the url
        match = serviceNameRegex.exec(url);

    return match[1];
};
