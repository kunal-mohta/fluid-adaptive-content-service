"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.checkCommonGoogleErrors");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.checkCommonGoogleErrors = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.google.checkCommonGoogleErrors(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockTranslationData = require("../../mockData/google/translation");

var testSeviceResponse = {
    noError: {
        statusCode: 200,
        body: mockTranslationData.responses.noError
    },
    keyInvalid: {
        statusCode: mockTranslationData.responses.keyInvalid.body.error.code,
        body: mockTranslationData.responses.keyInvalid.body
    },
    invalidLangCode: {
        statusCode: mockTranslationData.responses.invalidLangCode.body.error.code,
        body: mockTranslationData.responses.invalidLangCode.body
    },
    requestError: {
        statusCode: 500,
        body: {
            message: "Internal Server Error : Error with making request to the external service (Google)"
        }
    }
};

var expectedReturnVal = {
    noError: false,
    keyInvalid: {
        statusCode: 403,
        errorMessage: "Authentication failed - " + testSeviceResponse.keyInvalid.body.error.message
    },
    invalidLangCode: {
        statusCode: 404,
        errorMessage: "Invalid 'targetLang' parameter - Please check the language code"
    },
    requestError: {
        statusCode: 500,
        errorMessage: testSeviceResponse.requestError.body.message
    }
};

var testMessage = {
    noError: "Unit Test : For checkCommonGoogleErrors function (Google) : Successful with 'no error' response",
    keyInvalid: "Unit Test : For checkCommonGoogleErrors function (Google) : Successful with 'invalid key' response",
    invalidLangCode: "Unit Test : For checkCommonGoogleErrors function (Google) : Successful with 'invalid lang code' response",
    requestError: "Unit Test : For checkCommonGoogleErrors function (Google) : Successful with 'error making request' response"
};

jqunit.test(
    "Unit Test : For checkCommonGoogleErrors function (Google Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.translation.unitTests.checkCommonGoogleErrors(testMessage.noError, expectedReturnVal.noError, testSeviceResponse.noError);

        // for 'invalid key' response
        adaptiveContentService.tests.translation.unitTests.checkCommonGoogleErrors(testMessage.keyInvalid, expectedReturnVal.keyInvalid, testSeviceResponse.keyInvalid);

        // for 'invalid lang code' response
        adaptiveContentService.tests.translation.unitTests.checkCommonGoogleErrors(testMessage.invalidLangCode, expectedReturnVal.invalidLangCode, testSeviceResponse.invalidLangCode);

        // for 'error making request' response
        adaptiveContentService.tests.translation.unitTests.checkCommonGoogleErrors(testMessage.requestError, expectedReturnVal.requestError, testSeviceResponse.requestError);
    }
);
