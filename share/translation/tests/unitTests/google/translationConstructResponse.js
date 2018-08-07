"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.google.translationConstructResponse");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.google.translationConstructResponse = function (testMessage, expectedReturnVal, serviceResponse, targetLang) {
    var returnVal = adaptiveContentService.handlers.translation.google.detectAndTranslate.constructResponse(serviceResponse, targetLang);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

//mock data
var mockTranslationData = require("../../mockData/google/translation");

var testServiceResponse = {
    body: mockTranslationData.responses.noError
};

var expectedReturnVal = {
    sourceLang: testServiceResponse.body.detectedSourceLanguage,
    targetLang: mockTranslationData.targetLang.correct,
    sourceText: testServiceResponse.body.originalText,
    translatedText: testServiceResponse.body.translatedText
};

var testMessage = "Unit Test : For 'detect and translate' constructResponse function (Google) : Successful";

jqunit.test(
    "Unit Test : For 'detect and translate' constructResponse function (Google Service)",
    function () {
        adaptiveContentService.tests.translation.unitTests.google.translationConstructResponse(testMessage, expectedReturnVal, testServiceResponse, mockTranslationData.targetLang.correct);
    }
);
