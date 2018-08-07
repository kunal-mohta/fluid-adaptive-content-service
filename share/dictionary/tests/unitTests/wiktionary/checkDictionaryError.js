"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError");

require("../../../../../v1/dictionary/handlers/wiktionaryHandlers");

// mock data
var mockDefinitionsData = require("../../mockData/wiktionary/definitions");

var serviceResponse = {
    noError: mockDefinitionsData.responses.correctWord,
    wrongWord: mockDefinitionsData.responses.wrongWord,
    wrongLang: mockDefinitionsData.responses.wrongLang,
    otherErrors: {
        word: "word",
        err: "any other error"
    }
};

var testMessage = {
    noError: "Unit Test : For checkDictionary function (Wiktionary) : Successful with 'no error' response",
    wrongWord: "Unit Test : For checkDictionary function (Wiktionary) : Successful with 'wrong word' response",
    wrongLang: "Unit Test : For checkDictionary function (Wiktionary) : Successful with 'wrong language' response",
    otherErrors: "Unit Test : For checkDictionary function (Wiktionary) : Successful with any other response"
};

var expectedReturnVal = {
    noError: undefined,
    wrongWord: 404,
    wrongLang: 404,
    otherErrors: 501
};

adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError = function (serviceResponse, testMessage, expectedReturnVal) {
    var returnVal = adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError(serviceResponse);

    if (returnVal) {
        jqunit.assertEquals(testMessage, expectedReturnVal, returnVal.statusCode);
    }
    else {
        jqunit.assertEquals(testMessage, expectedReturnVal, returnVal);
    }
};

jqunit.test(
    "Unit Test : For checkDictionaryError function (Wiktionary Service)",
    function () {

        // for 'no error' response
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError(serviceResponse.noError, testMessage.noError, expectedReturnVal.noError);

        // for 'wrong word' error response
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError(serviceResponse.wrongWord, testMessage.wrongWord, expectedReturnVal.wrongWord);

        // for 'wrong lang' error response
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError(serviceResponse.wrongLang, testMessage.wrongLang, expectedReturnVal.wrongLang);

        //for all other errors response
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.checkDictionaryError(serviceResponse.otherErrors, testMessage.otherErrors, expectedReturnVal.otherErrors);
    }
);
