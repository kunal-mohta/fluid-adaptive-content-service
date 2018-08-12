"use strict";

var fluid = require("infusion"),
    makeRequest = require("request"); // npm package used to make requests to third-party services used

require("dotenv").config(); // npm package to get variables from '.env' file
require("../index");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms");

// grade getting us data from the oxford service
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms.getData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
        }
    }
});

adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms.getData = function (word, lang, apiKeys, that) {
    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/entries/" + lang + "/" + word + "/antonyms",
            headers: apiKeys
        },
        function (error, response, body) {
            adaptiveContentService.tests.utils.oxfordContractTestsRequestHandler(error, response, body, "Oxford - Antonyms", that);
        }
    );
};

// Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms.tester"
        }
    }
});

// mock data
var mockAntonymsData = require("../../mockData/oxford/antonyms");

var antonymSchemas = require("./schemas/antonymSchemas"), // main schemas which will be compiled
    commonSchemas = require("./schemas/commonSchemas"); // commonly used schemas

// array of all the schemas that are needed (other than the main schema)
var allNeededSchemas = {
    correctWord: [commonSchemas.antonyms, commonSchemas.examples, commonSchemas.oxfordResponseProperty, commonSchemas.commonOxford],
    wrongWord: [commonSchemas.oxfordResponseProperty],
    wrongLang: [commonSchemas.oxfordResponseProperty],
    authError: [commonSchemas.oxfordResponseProperty]
};

var successMessage = {
    correctWord: "Contract Test : For antonyms with correct word and language successful (Oxford Service)",
    wrongWord: "Contract Test : For antonyms with wrong word successful (Oxford Service)",
    wrongLang: "Contract Test : For antonyms with wrong language successful (Oxford Service)",
    authError: "Contract Test : For antonyms with wrong api keys successful (Oxford Service)"

};

var failureMessage = {
    correctWord: "Contract Test : For antonyms with correct word and language failed (Oxford Service)",
    wrongWord: "Contract Test : For antonyms with wrong word failed (Oxford Service)",
    wrongLang: "Contract Test : For antonyms with wrong language failed (Oxford Service)",
    authError: "Contract Test : For antonyms with wrong api keys failed (Oxford Service)"
};

// Test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For antonyms (Oxford Service)",
        tests: [
            {
                expect: 4,
                name: "Contract Tests : For antonyms (Oxford Service)",
                sequence: [
                    // for correct word
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockAntonymsData.word.correct, mockAntonymsData.lang.correct, mockAntonymsData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", antonymSchemas.correctWord, allNeededSchemas.correctWord, successMessage.correctWord, failureMessage.correctWord]
                    },
                    // for wrong word
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockAntonymsData.word.wrong, mockAntonymsData.lang.correct, mockAntonymsData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", antonymSchemas.wrongWord, allNeededSchemas.wrongWord, successMessage.wrongWord, failureMessage.wrongWord]
                    },
                    // for wrong language
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockAntonymsData.word.correct, mockAntonymsData.lang.wrong, mockAntonymsData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", antonymSchemas.wrongLang, allNeededSchemas.wrongLang, successMessage.wrongLang, failureMessage.wrongLang]
                    },
                    // for authentication fail
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockAntonymsData.word.correct, mockAntonymsData.lang.correct, mockAntonymsData.apiKeys.wrong]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", antonymSchemas.authError, allNeededSchemas.authError, successMessage.authError, failureMessage.authError]
                    }
                ]
            }
        ]
    }]
});

var testTree = adaptiveContentService.tests.dictionary.oxford.contractTests.antonyms.testTree;

adaptiveContentService.tests.utils.checkOxfordKeys(mockAntonymsData.correctApiKey, testTree, "Antonyms (Oxford) Contract test");
