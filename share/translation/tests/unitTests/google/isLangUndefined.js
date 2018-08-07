"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.google.isLangUndefined");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.google.isLangUndefined = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.google.langDetection.isLangUndefined(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockLangDetectionData = require("../../mockData/google/langDetection");

var testSeviceResponse = {
    noError: {
        statusCode: 200,
        body: mockLangDetectionData.responses.noError
    },
    cannotDetect: {
        statusCode: 404,
        body: mockLangDetectionData.responses.cannotDetect
    }
};

var expectedReturnVal = {
    noError: false,
    cannotDetect: {
        statusCode: 404,
        errorMessage: "Language could not be detected from the text provided"
    }
};

var testMessage = {
    noError: "Unit Test : For isLangUndefined function (Google) : Successful with 'no error' response",
    cannotDetect: "Unit Test : For isLangUndefined function (Google) : Successful with 'unable to detect lang' response"
};

jqunit.test(
    "Unit Test : For isLangUndefined function (Google Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.translation.unitTests.google.isLangUndefined(testMessage.noError, expectedReturnVal.noError, testSeviceResponse.noError);

        // for 'unable to detect lang' response
        adaptiveContentService.tests.translation.unitTests.google.isLangUndefined(testMessage.cannotDetect, expectedReturnVal.cannotDetect, testSeviceResponse.cannotDetect);
    }
);
