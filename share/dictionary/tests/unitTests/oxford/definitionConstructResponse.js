"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../index");

var testMessage = "Unit Test : For constructResponse function of definitions endpoint : Successful (Oxford Service)",
    constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.definition.constructResponse; //from oxfordHandlers.js

// mock service data
var mockDefinitionsData = require("../../index").mockData.oxford.definition, // file holding object with mock data
    jsonServiceData = mockDefinitionsData.responses.correctWord;

// expected return value from the function being tested
var expectedReturnVal = {
    word: mockDefinitionsData.word.correct,
    entries: [
        {
            category: "Verb",
            definitions: [
                "mock definition 1",
                "mock definition 2",
                "mock definition 3",
                "mock definition 4"
            ]
        },
        {
            category: "Noun",
            definitions: [
                "mock definition 5"
            ]
        }
    ]
};

var testFunction = adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse; //from testUtils.js

jqunit.test(
    "Unit Test : For constructResponse function of definitions endpoint (Oxford Service)",
    function () {
        testFunction(constructResponseFunction, jsonServiceData, expectedReturnVal, testMessage);
    }
);
