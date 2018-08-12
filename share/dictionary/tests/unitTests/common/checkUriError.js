"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.unitTests.checkUriError");

require("../index");

adaptiveContentService.tests.dictionary.unitTests.checkUriError = function (testMessage, expectedReturnVal, testWord, wordCharacterLimit) {
    var returnVal = adaptiveContentService.handlers.dictionary.checkUriError(testWord, wordCharacterLimit);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

var testWord = {
    shortWord: "short",
    longWord: "ThisIsAVeryLongWordWhichExceedsCharacterLimit"
};

var testMessage = {
    shortWord: "Unit Test : For checkUriError function : Successful with short word",
    longWord: "Unit Test : For checkUriError function : Successful with long word"
};

var wordCharacterLimit = 20; // set character limit for testing purpose

var expectedReturnVal = {
    shortWord: false,
    longWord: {
        statusCode: 414,
        errorMessage: "Request URI too long : 'word' can have maximum " + wordCharacterLimit + " characters"
    }
};

jqunit.test(
    "Unit Test : For checkUriError function (Dictionary Service)",
    function () {

        // for short word
        adaptiveContentService.tests.dictionary.unitTests.checkUriError(testMessage.shortWord, expectedReturnVal.shortWord, testWord.shortWord, wordCharacterLimit);

        // for long word
        adaptiveContentService.tests.dictionary.unitTests.checkUriError(testMessage.longWord, expectedReturnVal.longWord, testWord.longWord, wordCharacterLimit);
    }
);
