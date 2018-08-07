"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.checkCommonYandexErrors");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.checkCommonYandexErrors = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.checkCommonYandexErrors(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockTranslationData = require("../../mockData/yandex/translation");

var testSeviceResponse = {
    noError: {
        statusCode: mockTranslationData.responses.noError.code,
        body: mockTranslationData.responses.noError
    },
    keyInvalid: {
        statusCode: mockTranslationData.responses.keyInvalid.code,
        body: mockTranslationData.responses.keyInvalid
    },
    limitExceeded: {
        statusCode: mockTranslationData.responses.limitExceeded.code,
        body: mockTranslationData.responses.limitExceeded
    },
    unsupportedTranslation: {
        statusCode: mockTranslationData.responses.unsupportedTranslation.code,
        body: mockTranslationData.responses.unsupportedTranslation
    },
    keyBlocked: {
        statusCode: mockTranslationData.responses.keyBlocked.code,
        body: mockTranslationData.responses.keyBlocked
    }
};

var expectedReturnVal = {
    noError: false,
    keyInvalid: {
        statusCode: 403,
        errorMessage: "Authenticaion failed - " + testSeviceResponse.keyInvalid.body.message
    },
    limitExceeded: {
        statusCode: 429,
        errorMessage: testSeviceResponse.limitExceeded.body.message
    },
    unsupportedTranslation: {
        statusCode: 404,
        errorMessage: testSeviceResponse.unsupportedTranslation.body.message + " - Please check the language codes"
    },
    keyBlocked: {
        statusCode: testSeviceResponse.keyBlocked.statusCode,
        errorMessage: testSeviceResponse.keyBlocked.body.message
    }
};

var testMessage = {
    noError: "Unit Test : For checkCommonYandexErrors function (Yandex) : Successful with 'no error' response",
    keyInvalid: "Unit Test : For checkCommonYandexErrors function (Yandex) : Successful with 'invalid key' response",
    limitExceeded: "Unit Test : For checkCommonYandexErrors function (Yandex) : Successful with 'limit exceeded' response",
    unsupportedTranslation: "Unit Test : For checkCommonYandexErrors function (Yandex) : Successful with 'unsupported translation' response",
    keyBlocked: "Unit Test : For checkCommonYandexErrors function (Yandex) : Successful with 'blocked key' response"
};

jqunit.test(
    "Unit Test : For checkCommonYandexErrors function (Yandex Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.translation.unitTests.checkCommonYandexErrors(testMessage.noError, expectedReturnVal.noError, testSeviceResponse.noError);

        // for 'invalid key' response
        adaptiveContentService.tests.translation.unitTests.checkCommonYandexErrors(testMessage.keyInvalid, expectedReturnVal.keyInvalid, testSeviceResponse.keyInvalid);

        // for 'limit exceeded' response
        adaptiveContentService.tests.translation.unitTests.checkCommonYandexErrors(testMessage.limitExceeded, expectedReturnVal.limitExceeded, testSeviceResponse.limitExceeded);

        // for 'unsupported translation' response
        adaptiveContentService.tests.translation.unitTests.checkCommonYandexErrors(testMessage.unsupportedTranslation, expectedReturnVal.unsupportedTranslation, testSeviceResponse.unsupportedTranslation);

        // for 'blocked key' response
        adaptiveContentService.tests.translation.unitTests.checkCommonYandexErrors(testMessage.keyBlocked, expectedReturnVal.keyBlocked, testSeviceResponse.keyBlocked);
    }
);
