"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("../index");

var testMessage = {
        frequency: "Unit Test : For constructResponse function of frequency endpoint : Successful (Oxford Service)",
        extendedFrequency: "Unit Test : For constructResponse function of extended frequency endpoint : Successful (Oxford Service)"
    },
    constructResponseFunction = adaptiveContentService.handlers.dictionary.oxford.frequency.constructResponse; //from oxfordHandlers.js

// mock service data
var mockFrequencyData = require("../../index").mockData.oxford.frequency, //file holding object with mock data (frequency)
    mockExtendedFrequencyData = require("../../index").mockData.oxford.extendedFrequency, // file holding object with mock data
    jsonServiceData = {
        frequency: mockFrequencyData.responses.correctWord,
        extendedFrequency: mockExtendedFrequencyData.responses.correctWord
    };

// expected return value from the function being tested
var expectedReturnVal = {
    frequency: {
        word: mockFrequencyData.word.correct,
        frequency: mockFrequencyData.frequency
    },
    extendedFrequency: {
        word: mockExtendedFrequencyData.word.correct,
        frequency: mockExtendedFrequencyData.frequency,
        lexicalCategory: mockExtendedFrequencyData.lexicalCategory
    }
};

var testFunction = adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse; //from testUtils.js

jqunit.test(
    "Unit Test : For constructResponse function of frequency and extended frequency endpoint (Oxford Service)",
    function () {

        //for frequency endpoint
        testFunction(constructResponseFunction, jsonServiceData.frequency, expectedReturnVal.frequency, testMessage.frequency);

        //for extended frequency endpoint
        testFunction(constructResponseFunction, jsonServiceData.extendedFrequency, expectedReturnVal.extendedFrequency, testMessage.extendedFrequency);
    }
);
