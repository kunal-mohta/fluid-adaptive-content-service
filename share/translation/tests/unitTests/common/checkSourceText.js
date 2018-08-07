"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.checkSourceText");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.checkSourceText = function (testMessage, expectedReturnVal, testText, wordCharacterLimit) {
    var returnVal = adaptiveContentService.handlers.translation.checkSourceText(testText, wordCharacterLimit);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

var wordCharacterLimit = 10; // set character limit for testing purpose

// mock data
var mockData = require("../../mockData/common/translation");

var testText = {
    noTextField: mockData.text.absent,
    emptyTextField: mockData.text.empty,
    tooLongText: mockData.text.tooLong
};

var expectedReturnVal = {
    noTextField: {
        statusCode: 400,
        errorMessage: "Request body doesn't contain 'text' field"
    },
    emptyTextField: {
        statusCode: 400,
        errorMessage: "Request body doesn't contain 'text' field"
    },
    tooLongText: {
        statusCode: 413,
        errorMessage: "Text in the request body should have character count less than or equal to " + wordCharacterLimit
    }
};

var testMessage = {
    noTextField: "Unit Test : For checkSourceText function (Translation Service) : Successful with no text field",
    emptyTextField: "Unit Test : For checkSourceText function (Translation Service) : Successful with empty text field",
    tooLongText: "Unit Test : For checkSourceText function (Translation Service) : Successful with too long text"
};

jqunit.test(
    "Unit Test : For checkSourceText function (Translation Service)",
    function () {

        // for no text field
        adaptiveContentService.tests.translation.unitTests.checkSourceText(testMessage.noTextField, expectedReturnVal.noTextField, testText.noTextField, wordCharacterLimit);

        // for empty text field
        adaptiveContentService.tests.translation.unitTests.checkSourceText(testMessage.emptyTextField, expectedReturnVal.emptyTextField, testText.emptyTextField, wordCharacterLimit);

        // for too long text
        adaptiveContentService.tests.translation.unitTests.checkSourceText(testMessage.tooLongText, expectedReturnVal.tooLongText, testText.tooLongText, wordCharacterLimit);
    }
);
