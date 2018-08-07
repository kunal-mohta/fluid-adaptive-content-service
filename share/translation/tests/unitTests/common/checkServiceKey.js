"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.checkServiceKey");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.checkServiceKey = function (testMessage, expectedReturnVal, testServiceKey) {
    var returnVal = adaptiveContentService.handlers.translation.checkServiceKey(testServiceKey);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

var testServiceKey = {
    noKey: undefined,
    emptyKey: "",
    presentKey: "this-is-an-example-key"
};

var expectedReturnVal = {
    noKey: {
        statusCode: 403,
        errorMessage: "Authentication failed - API key not found. Please check your environment variables"
    },
    emptyKey: {
        statusCode: 403,
        errorMessage: "Authentication failed - API key not found. Please check your environment variables"
    },
    presentKey: false
};

var testMessage = {
    noKey: "Unit Test : For checkServiceKey function (Translation Service) : Successful with key absent",
    emptyKey: "Unit Test : For checkServiceKey function (Translation Service) : Successful with key empty",
    presentKey: "Unit Test : For checkServiceKey function (Translation Service) : Successful with key present"
};

jqunit.test(
    "Unit Test : For checkServiceKey function (Translation Service)",
    function () {

        // for key absent
        adaptiveContentService.tests.translation.unitTests.checkServiceKey(testMessage.noKey, expectedReturnVal.noKey, testServiceKey.noKey);

        // for key empty
        adaptiveContentService.tests.translation.unitTests.checkServiceKey(testMessage.emptyKey, expectedReturnVal.emptyKey, testServiceKey.emptyKey);

        // for key present
        adaptiveContentService.tests.translation.unitTests.checkServiceKey(testMessage.presentKey, expectedReturnVal.presentKey, testServiceKey.presentKey);
    }
);
