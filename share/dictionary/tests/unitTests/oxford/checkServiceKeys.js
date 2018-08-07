"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.unitTests.checkServiceKeys");

require("../../../../../v1/dictionary/handlers");

adaptiveContentService.tests.dictionary.oxford.unitTests.checkServiceKeys = function (testMessage, expectedReturnVal, keyHeaders) {
    var returnVal = adaptiveContentService.handlers.dictionary.oxford.checkServiceKeys(keyHeaders);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

var keyHeaders = {
    appIdAbsent: {
        app_id: undefined,
        app_key: "randomstring"
    },
    appKeyAbsent: {
        app_id: "randomstring",
        app_key: undefined
    },
    bothPresent: {
        app_id: "randomstring",
        app_key: "randomstring"
    }
};

var expectedReturnVal = {
    appIdAbsent: {
        statusCode: 403,
        errorMessage: "Authentication failed - 'App Id' not found. Please check your environment variables"
    },
    appKeyAbsent: {
        statusCode: 403,
        errorMessage: "Authentication failed - 'App Key' not found. Please check your environment variables"
    },
    bothPresent: false
};

var testMessage = {
    appIdAbsent: "Unit Test : For checkServiceKeys function (Oxford) : Successful with app id absent",
    appKeyAbsent: "Unit Test : For checkServiceKeys function (Oxford) : Successful with app key absent",
    bothPresent: "Unit Test : For checkServiceKeys function (Oxford) : Successful with both app id and key present"
};

jqunit.test(
    "Unit Test : For checkServiceKeys function (Oxford Service)",
    function () {

        // for app id absent
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkServiceKeys(testMessage.appIdAbsent, expectedReturnVal.appIdAbsent, keyHeaders.appIdAbsent);

        // for app key absent
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkServiceKeys(testMessage.appKeyAbsent, expectedReturnVal.appKeyAbsent, keyHeaders.appKeyAbsent);

        // for both app id and key present
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkServiceKeys(testMessage.bothPresent, expectedReturnVal.bothPresent, keyHeaders.bothPresent);
    }
);
