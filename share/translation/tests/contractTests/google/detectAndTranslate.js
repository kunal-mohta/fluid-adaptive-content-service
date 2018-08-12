"use strict";

var fluid = require("infusion");

require("dotenv").config(); // npm package to get variables from '.env' file
require("../index");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate");

// grade getting us data from the google service
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate.getData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{that}"]
        }
    }
});

adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate.getData = function (targetLang, text, serviceKey, that) {
    var googleTranslate = require("google-translate")(serviceKey); // package for convenient usage of google translation service

    googleTranslate.translate(text, targetLang, function (err, translation) {
        adaptiveContentService.tests.utils.googleContractTestRequestHandler(err, translation, "Google - Detect-and-Translate", that);
    });
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate.tester"
        }
    }
});

var detectAndTranslateSchemas = require("./schemas/detectAndTranslateSchemas"); //main schemas which will be compiled

var successMessage = {
    noError: "Contract Test : For 'detect and translate' with 'no error' response successful (Google Service)",
    invalidTargetLang: "Contract Test : For 'detect and translate' for invalid target language successful (Google Service)",
    wrongKey: "Contract Test : For 'detect and translate' with wrong service api key successful (Google Service)"
};

var failureMessage = {
    noError: "Contract Test : For 'detect and translate' with 'no error' response failed (Google Service)",
    invalidTargetLang: "Contract Test : For 'detect and translate' for invalid target language failed (Google Service)",
    wrongKey: "Contract Test : For 'detect and translate' with wrong service api key failed (Google Service)"
};

//mock data
var mockTranslationData = require("../../mockData/google/translation");

//Test driver
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For 'detect and translate' (Google Service)",
        tests: [
            {
                expect: 3,
                name: "Contract Tests : For 'detect and translate' (Google Service)",
                sequence: [
                    //for 'no error' response
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockTranslationData.targetLang.correct, mockTranslationData.text.noError, mockTranslationData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", detectAndTranslateSchemas.noError, null,   successMessage.noError, failureMessage.noError]
                    },
                    //for invalid target language
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockTranslationData.
                          targetLang.wrong, mockTranslationData.text.noError, mockTranslationData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", detectAndTranslateSchemas.langError, null,   successMessage.invalidTargetLang, failureMessage.invalidTargetLang]
                    },
                    //for wrong service key
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockTranslationData.targetLang.correct, mockTranslationData.text.noError, mockTranslationData.apiKey.invalid]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", detectAndTranslateSchemas.authError, null,   successMessage.wrongKey, failureMessage.wrongKey]
                    }
                ]
            }
        ]
    }]
});

var serviceKey = adaptiveContentService.tests.utils.getGoogleServiceKey(),
    testTree = adaptiveContentService.tests.translation.google.contractTests.detectAndTranslate.testTree;

adaptiveContentService.tests.utils.checkGoogleKeys(serviceKey, testTree, "Detect-And-Translate text (Google) Contract test");
