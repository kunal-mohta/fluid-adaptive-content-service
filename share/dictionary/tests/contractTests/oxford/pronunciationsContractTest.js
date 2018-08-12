"use strict";

var fluid = require("infusion"),
    makeRequest = require("request"); // npm package used to make requests to third-party services used

require("dotenv").config(); // npm package to get variables from '.env' file
require("../index");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations");

//grade getting us data from the oxford service
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations.getData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
        }
    }
});

adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations.getData = function (word, lang, apiKeys, that) {
    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/entries/" + lang + "/" + word,
            headers: apiKeys
        },
        function (error, response, body) {
            adaptiveContentService.tests.utils.oxfordContractTestsRequestHandler(error, response, body, "Oxford - Pronunciations", that);
        }
    );
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations.tester"
        }
    }
});

var mockPronunciationData = require("../../mockData/oxford/pronunciations");

var pronunciationSchemas = require("./schemas/pronunciationSchemas"), //main schemas which will be compiled
    commonSchemas = require("./schemas/commonSchemas"); //commonly used schemas


//array of all the schemas that are needed (other than the main schema)
var allNeededSchemas = {
    correctWord: [commonSchemas.oxfordResponseProperty, commonSchemas.commonOxford],
    wrongWord: [commonSchemas.oxfordResponseProperty],
    wrongLang: [commonSchemas.oxfordResponseProperty],
    authError: [commonSchemas.oxfordResponseProperty]
};

var successMessage = {
    correctWord: "Contract Test : For pronunciations with correct word and language successful (Oxford Service)",
    wrongWord: "Contract Test : For pronunciations with wrong word successful (Oxford Service)",
    wrongLang: "Contract Test : For pronunciations with wrong language successful (Oxford Service)",
    authError: "Contract Test : For pronunciations with wrong api keys successful (Oxford Service)"
};

var failureMessage = {
    correctWord: "Contract Test : For pronunciations with correct word and language failed (Oxford Service)",
    wrongWord: "Contract Test : For pronunciations with wrong word failed (Oxford Service)",
    wrongLang: "Contract Test : For pronunciations with wrong language failed (Oxford Service)",
    authError: "Contract Test : For pronunciations with wrong api keys failed (Oxford Service)"
};

//Test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For pronunciations (Oxford Service)",
        tests: [
            {
                expect: 4,
                name: "Contract Tests : For pronunciations (Oxford Service)",
                sequence: [
                    //for correct word
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockPronunciationData.word.correct, mockPronunciationData.lang.correct, mockPronunciationData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", pronunciationSchemas.correctWord, allNeededSchemas.correctWord, successMessage.correctWord, failureMessage.correctWord]
                    },
                    //for wrong word
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockPronunciationData.word.wrong, mockPronunciationData.lang.correct, mockPronunciationData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", pronunciationSchemas.wrongWord, allNeededSchemas.wrongWord, successMessage.wrongWord, failureMessage.wrongWord]
                    },
                    //for wrong language
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockPronunciationData.word.correct, mockPronunciationData.lang.wrong, mockPronunciationData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", pronunciationSchemas.wrongLang, allNeededSchemas.wrongLang, successMessage.wrongLang, failureMessage.wrongLang]
                    },
                    // for authentication fail
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockPronunciationData.word.correct, mockPronunciationData.lang.correct, mockPronunciationData.apiKeys.wrong]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", pronunciationSchemas.authError, allNeededSchemas.authError, successMessage.authError, failureMessage.authError]
                    }
                ]
            }
        ]
    }]
});

var testTree = adaptiveContentService.tests.dictionary.oxford.contractTests.pronunciations.testTree;

adaptiveContentService.tests.utils.checkOxfordKeys(mockPronunciationData.correctApiKey, testTree, "Pronunciations (Oxford) Contract test");
