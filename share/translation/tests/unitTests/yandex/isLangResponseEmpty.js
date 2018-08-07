"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.isLangResponseEmpty");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.isLangResponseEmpty = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.isLangResponseEmpty(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockLangDetectionData = require("../../mockData/yandex/langDetection");

var testSeviceResponse = {
    noError: {
        statusCode: mockLangDetectionData.responses.noError.code,
        body: mockLangDetectionData.responses.noError
    },
    cannotDetect: {
        statusCode: mockLangDetectionData.responses.cannotDetect.code,
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
    noError: "Unit Test : For isLangResponseEmpty function (Yandex) : Successful with 'no error' response",
    cannotDetect: "Unit Test : For isLangResponseEmpty function (Yandex) : Successful with 'unable to detect lang' response"
};

jqunit.test(
    "Unit Test : For isLangResponseEmpty function (Yandex Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.translation.unitTests.isLangResponseEmpty(testMessage.noError, expectedReturnVal.noError, testSeviceResponse.noError);

        // for 'unable to detect lang' response
        adaptiveContentService.tests.translation.unitTests.isLangResponseEmpty(testMessage.cannotDetect, expectedReturnVal.cannotDetect, testSeviceResponse.cannotDetect);
    }
);
