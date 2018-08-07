"use strict";

var fluid = require("infusion");

require("dotenv").config(); // npm package to get variables from '.env' file
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.google.contractTests.langDetection");

// grade getting us data from the google service
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.langDetection", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.translation.google.contractTests.langDetection.getData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        }
    }
});

adaptiveContentService.tests.translation.google.contractTests.langDetection.getData = function (text, serviceKey, that) {
    var googleTranslate = require("google-translate")(serviceKey); // package for convenient usage of google translation service

    googleTranslate.detectLanguage(text, function (err, detection) {
        adaptiveContentService.tests.utils.googleContractTestRequestHandler(err, detection, "Google - Language Detection", that);
    });
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.langDetection.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.translation.google.contractTests.langDetection"
        },
        // test driver
        tester: {
            type: "adaptiveContentService.tests.translation.google.contractTests.langDetection.tester"
        }
    }
});

var langDetectionSchemas = require("./schemas/langDetectionSchemas"); // main schemas which will be compiled

var successMessage = {
    noError: "Contract Test : For lang detection with 'no error' response successful (Google Service)",
    cannotDetect: "Contract Test : For lang detection for 'unable to detect' response successful (Google Service)",
    wrongKey: "Contract Test : For lang detection with wrong service api key successful (Google Service)"
};

var failureMessage = {
    noError: "Contract Test : For lang detection with 'no error' response failed (Google Service)",
    cannotDetect: "Contract Test : For lang detection for 'unable to detect' response failed (Google Service)",
    wrongKey: "Contract Test : For lang detection with wrong service api key failed (Google Service)"
};

//mock data
var mockLangDetectionData = require("../../mockData/google/langDetection");

//Test driver
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.langDetection.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For lang detection (Google Service)",
        tests: [
            {
                expect: 3,
                name: "Contract Tests : For lang detection (Google Service)",
                sequence: [
                    //for 'no error' response
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockLangDetectionData.text.noError, mockLangDetectionData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", langDetectionSchemas.noError, null,   successMessage.noError, failureMessage.noError]
                    },
                    //for 'unable to detect' response
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockLangDetectionData.text.numerical, mockLangDetectionData.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", langDetectionSchemas.cannotDetect, null,   successMessage.cannotDetect, failureMessage.cannotDetect]
                    },
                    //for wrong service key
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockLangDetectionData.text.noError, mockLangDetectionData.apiKey.invalid]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", langDetectionSchemas.authError, null,   successMessage.wrongKey, failureMessage.wrongKey]
                    }
                ]
            }
        ]
    }]
});

var serviceKey = adaptiveContentService.tests.utils.getGoogleServiceKey(),
    testTree = adaptiveContentService.tests.translation.google.contractTests.langDetection.testTree;

adaptiveContentService.tests.utils.checkGoogleKeys(serviceKey, testTree, "Language Detection (Google) Contract test");
