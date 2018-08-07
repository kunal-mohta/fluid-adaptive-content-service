"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.google.langDetectionConstructResponse");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.google.langDetectionConstructResponse = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.google.langDetection.constructResponse(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockLangDetectionData = require("../../mockData/google/langDetection");

var testServiceResponse = {
    body: mockLangDetectionData.responses.noError
};

var expectedReturnVal = {
    sourceText: testServiceResponse.body.originalText,
    langCode: testServiceResponse.body.language
};

var testMessage = "Unit Test : For language detection constructResponse function (Google) : Successful";

jqunit.test(
    "Unit Test : For language detection constructResponse function (Google Service)",
    function () {
        adaptiveContentService.tests.translation.unitTests.google.langDetectionConstructResponse(testMessage, expectedReturnVal, testServiceResponse);
    }
);
