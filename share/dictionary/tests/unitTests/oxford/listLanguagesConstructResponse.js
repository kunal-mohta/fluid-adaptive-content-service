"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../index");

var testMessage = "Unit Test : For constructResponse function of list supported languages endpoint : Successful (Oxford Service)",
    constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.listLanguages.constructResponse; //from oxfordHandlers.js

// mock service data
var mockListLanguagesData = require("../../index").mockData.oxford.listLanguages, // file holding object with mock data
    jsonServiceData = mockListLanguagesData.responses.noError;

// expected return value from the function being tested
var expectedReturnVal = {
    languages: [
        {
            code: "en",
            name: "English"
        },
        {
            code: "de",
            name: "German"
        }
    ]
};

var testFunction = adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse; //from testUtils.js

jqunit.test(
    "Unit Test : For constructResponse function of pronunciations endpoint (Oxford Service)",
    function () {
        testFunction(constructResponseFunction, jsonServiceData, expectedReturnVal, testMessage);
    }
);
