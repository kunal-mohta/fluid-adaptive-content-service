"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.unitTests.constructResponse");

require("../../../../../v1/dictionary/handlers/wiktionaryHandlers");

// mock service data
var mockDefinitionsData = require("../../mockData/wiktionary/definitions"),// file holding object with mock data
    jsonServiceData = mockDefinitionsData.responses.correctWord;

adaptiveContentService.tests.dictionary.wiktionary.unitTests.constructResponse = function () {
    var returnVal = adaptiveContentService.handlers.dictionary.wiktionary.definition.constructResponse(jsonServiceData);

    var expectedReturnVal = {
        word: "happy",
        entries: [
            {
                category: "adjective",
                definitions: [
                    "This is definition of the word"
                ]
            }
        ]
    };

    jqunit.assertDeepEq("Unit Test : For constructResponse function : Successful", expectedReturnVal, returnVal);
};

jqunit.test(
    "Unit Test : For constructResponse function (Dictionary Service)",
    function () {
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.constructResponse();
    }
);
