"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");

//mock data
var mockData = require("../../mockData/oxford/definitions");

var serviceResponse = {
    noError: {
        statusCode: 200
    },
    authFail: {
        statusCode: 403,
        body: mockData.responses.authError
    },
    wrongWord: {
        statusCode: 404,
        body: mockData.responses.wrongWord
    },
    wrongLang: {
        statusCode: 404,
        body: mockData.responses.wrongLang
    },
    unhandledError: {
        statusCode: 555, //random code that has not been handled
        body: ""
    }
};

var testMessage = {
    noError: "Unit Test : For checkDictionary function (Oxford) : Successful with 'no error' response",
    authFail: "Unit Test : For checkDictionary function (Oxford) : Successful with 'failed authentication' response",
    wrongWord: "Unit Test : For checkDictionary function (Oxford) : Successful with 'wrong word' response",
    wrongLang: "Unit Test : For checkDictionary function (Oxford) : Successful with 'wrong language' response",
    unhandledError: "Unit Test : For checkDictionary function (Oxford) : Successful with 'unhandled error' response"
};

var expectedReturnVal = {
    noError: undefined,
    authFail: 403,
    wrongWord: 404,
    wrongLang: 404,
    unhandledError: 501
};

adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError = function (serviceResponse, testMessage, expectedReturnVal) {
    var returnVal = adaptiveContentService.handlers.dictionary.oxford.checkDictionaryError(serviceResponse);

    if (returnVal) {
        jqunit.assertEquals(testMessage, expectedReturnVal, returnVal.statusCode);
    }
    else {
        jqunit.assertEquals(testMessage, expectedReturnVal, returnVal);
    }
};

jqunit.test(
    "Unit Test : For checkDictionaryError function (Oxford Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.noError, testMessage.noError, expectedReturnVal.noError);

        // for 'failed authentication' response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.authFail, testMessage.authFail, expectedReturnVal.authFail);

        // for 'wrong word' error response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.wrongWord, testMessage.wrongWord, expectedReturnVal.wrongWord);

        // for 'wrong lang' error response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.wrongLang, testMessage.wrongLang, expectedReturnVal.wrongLang);

        //for 'unhandled error' response
        adaptiveContentService.tests.dictionary.oxford.unitTests.checkDictionaryError(serviceResponse.unhandledError, testMessage.unhandledError, expectedReturnVal.unhandledError);
    }
);
