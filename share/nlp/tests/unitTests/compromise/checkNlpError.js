"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError");

require("../../../../../v1/nlp/handlers");

adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError = function (requestSentence, characterLimit, testMessage, expectedReturnVal) {
    var returnVal = adaptiveContentService.handlers.nlp.compromise.sentenceTagging.checkNlpError(requestSentence, characterLimit);

    if (returnVal) {
        jqunit.assertEquals(testMessage, expectedReturnVal, returnVal.statusCode);
    }
    else {
        jqunit.assertEquals(testMessage, expectedReturnVal, returnVal);
    }
};

var characterLimit = 40;

var requestSentence = {
    correctSentence: "This is correct sentence",
    longSentence: "This is a long statement, exceeding character limit",
    emptySentence: ""
};

var testMessage = {
    correctSentence: "Unit Test : For checkNlpError function : Successful with correct sentence",
    longSentence: "Unit Test : For checkNlpError function : Successful with long sentence",
    emptySentence: "Unit Test : For checkNlpError function : Successful with empty sentence"
};

var expectedReturnVal = {
    correctSentence: undefined,
    longSentence: 413,
    emptySentence: 400
};

jqunit.test(
    "Unit Test : For checkNlpError function (Compromise Service)",
    function () {

        // for correct request sentence
        adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError(requestSentence.correctSentence, characterLimit, testMessage.correctSentence, expectedReturnVal.correctSentence);

        // for long request sentence
        adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError(requestSentence.longSentence, characterLimit, testMessage.longSentence, expectedReturnVal.longSentence);

        // for empty request sentence
        adaptiveContentService.tests.nlp.compromise.unitTests.checkNlpError(requestSentence.emptySentence, characterLimit, testMessage.emptySentence, expectedReturnVal.emptySentence);
    }
);
