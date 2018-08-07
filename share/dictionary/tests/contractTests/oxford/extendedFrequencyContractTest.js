"use strict";

var fluid = require("infusion"),
    makeRequest = require("request"); // npm package used to make requests to third-party services used

require("dotenv").config(); // npm package to get variables from '.env' file
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency");

//grade getting us data from the oxford service
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.getData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        }
    }
});

adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.getData = function (word, lang, lexicalCategory, apiKeys, that) {
    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/stats/frequency/word/" + lang + "/?lemma=" + word + "&lexicalCategory=" + lexicalCategory,
            headers: apiKeys
        },
        function (error, response, body) {
            adaptiveContentService.tests.utils.oxfordContractTestsRequestHandler(error, response, body, "Oxford - Extended Frequency", that);
        }
    );
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.tester"
        }
    }
});

// mock data
var mockExtendedFrequencyData = require("../../mockData/oxford/extendedFrequency");

var extendedFrequencySchemas = require("./schemas/extendedFrequencySchemas"), //main schemas which will be compiled
    frequencySchemas = require("./schemas/frequencySchemas"), //frequency schema
    commonSchemas = require("./schemas/commonSchemas"); //commonly used schemas


//array of all the schemas that are needed (other than the main schema)
var allNeededSchemas = {
    correctWord: [commonSchemas.oxfordResponseProperty, frequencySchemas.correctWord],
    wrongLang: [commonSchemas.oxfordResponseProperty],
    authError: [commonSchemas.oxfordResponseProperty]
};

var successMessage = {
    correctWord: "Contract Test : For extended frequency with correct word and language successful (Oxford Service)",
    wrongLang: "Contract Test : For extended frequency with wrong language successful (Oxford Service)",
    authError: "Contract Test : For extended frequency with wrong api keys successful (Oxford Service)"
};

var failureMessage = {
    correctWord: "Contract Test : For extended frequency with correct word and language failed (Oxford Service)",
    wrongLang: "Contract Test : For extended frequency with wrong language failed (Oxford Service)",
    authError: "Contract Test : For extended frequency with wrong api keys failed (Oxford Service)"
};

//Test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For extended frequency (Oxford Service)",
        tests: [
            {
                expect: 3,
                name: "Contract Tests : For extended frequency (Oxford Service)",
                sequence: [
                    //for correct word
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockExtendedFrequencyData.word.correct, mockExtendedFrequencyData.lang.correct, mockExtendedFrequencyData.lexicalCategory, mockExtendedFrequencyData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", extendedFrequencySchemas.correctWord, allNeededSchemas.correctWord, successMessage.correctWord, failureMessage.correctWord]
                    },
                    //for wrong language
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockExtendedFrequencyData.word.correct, mockExtendedFrequencyData.lang.wrong, mockExtendedFrequencyData.lexicalCategory, mockExtendedFrequencyData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", extendedFrequencySchemas.wrongLang, allNeededSchemas.wrongLang, successMessage.wrongLang, failureMessage.wrongLang]
                    },
                    // for authentication fail
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockExtendedFrequencyData.word.correct, mockExtendedFrequencyData.lang.correct, mockExtendedFrequencyData.apiKeys.wrong]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", frequencySchemas.authError, allNeededSchemas.authError, successMessage.authError, failureMessage.authError]
                    }
                ]
            }
        ]
    }]
});

/*
 * No wrong word test here
 * because the frequency is returned 0 for them
 */

var testTree = adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.testTree;

adaptiveContentService.tests.utils.checkOxfordKeys(mockExtendedFrequencyData.correctApiKey, testTree, "Frequency (Oxford) Contract test (Extended)");
