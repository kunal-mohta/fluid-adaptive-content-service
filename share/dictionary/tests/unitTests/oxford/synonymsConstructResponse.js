"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../index");

var testMessage = "Unit Test : For constructResponse function of synonyms endpoint : Successful (Oxford Service)",
    constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.synonyms.constructResponse; //from oxfordHandlers.js

// mock service data
var mockSynonymsData = require("../../index").mockData.oxford.synonyms, // file holding object with mock data
    jsonServiceData = mockSynonymsData.responses.correctWord;

// expected return value from the function being tested
var expectedReturnVal = {
    word: mockSynonymsData.word.correct,
    entries: [
        {
            category: "Noun",
            senses: [
                {
                    examples: ["mock example 1"],
                    synonyms: [
                        "mock synonym 1",
                        "mock synonym 2"
                    ]
                }
            ]
        },
        {
            category: "Verb",
            senses: [
                {
                    examples: [],
                    synonyms: [ "mock synonym 3" ]
                }
            ]
        }
    ]
};

var testFunction = adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse; //from testUtils.js

jqunit.test(
    "Unit Test : For constructResponse function of synonyms endpoint (Oxford Service)",
    function () {
        testFunction(constructResponseFunction, jsonServiceData, expectedReturnVal, testMessage);
    }
);
