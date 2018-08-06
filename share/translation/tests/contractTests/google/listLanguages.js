/* Contract tests (Google) for both
 * List languages - /languages
 * Extended list languages - /languages/:lang
 */

"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");
require("dotenv").config(); // npm package to get variables from '.env' file

require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");
fluid.registerNamespace("adaptiveContentService.tests.translation.google.contractTests.listLanguages");

// grade getting us data from the google service
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.listLanguages", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.translation.google.contractTests.listLanguages.getData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        }
    }
});

adaptiveContentService.tests.translation.google.contractTests.listLanguages.getData = function (serviceKey, lang, that) {
    var googleTranslate = require("google-translate")(serviceKey); // package for convenient usage of google translation service

    googleTranslate.getSupportedLanguages(lang, function (err, languageCodes) {
        if (err) {

            // error making request
            if (err.body === undefined) {
                ACS.log("Contract Test (Google - List Supported Languages) - Error occured while making request to the external service");
                jqunit.fail("Contract Test : For listing supported languages failed due to error making request to the external service (Google Service)");
            }
            // request successful, but other errors catched
            else {
                var jsonBody;

                // is error body json parseable
                try {
                    jsonBody = JSON.parse(err.body);
                    that.events.onDataReceive.fire(jsonBody);
                }
                catch (e) {
                    ACS.log("Contract Test (Google - List Supported Languages) - Error occured while parsing the error response body; body should be JSON pareseable -  " + e);
                    ACS.log("Contract Test (Google - List Supported Languages) - Error Response body - \n" + err.body);
                    jqunit.fail("Contract Test : For listing supported languages failed due to error parsing error response body into JSON");
                }
            }
        }
        // No errors
        else {
            that.events.onDataReceive.fire(languageCodes);
        }
    });
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.listLanguages.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.translation.google.contractTests.listLanguages"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.translation.google.contractTests.listLanguages.tester"
        }
    }
});

var listLanguagesSchemas = require("./schemas/listLanguagesSchemas"); //main schemas which will be compiled

var successMessage = {
    noError: "Contract Test : For listing supported languages with 'no error' response successful (Google Service)",
    wrongKey: "Contract Test : For listing supported languages with wrong service api key successful (Google Service)"
};

var failureMessage = {
    noError: "Contract Test : For listing supported languages with 'no error' response failed (Google Service)",
    wrongKey: "Contract Test : For listing supported languages with wrong service api key failed (Google Service)"
};

//mock data
var mockListLanguages = require("../../mockData/google/listLanguages");

//Test driver
fluid.defaults("adaptiveContentService.tests.translation.google.contractTests.listLanguages.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For listing supported languages (Google Service)",
        tests: [
            {
                expect: 2,
                name: "Contract Tests : For listing supported languages (Google Service)",
                sequence: [
                    //for 'no error' response
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockListLanguages.correctApiKey, mockListLanguages.langParam]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", listLanguagesSchemas.noError,  null, successMessage.noError, failureMessage.noError]
                    },
                    //for wrong service key
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockListLanguages.apiKey.invalid, mockListLanguages.langParam]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", listLanguagesSchemas.authError, null,   successMessage.wrongKey, failureMessage.wrongKey]
                    }
                ]
            }
        ]
    }]
});

var serviceKey = adaptiveContentService.tests.utils.getGoogleServiceKey(),
    testTree = adaptiveContentService.tests.translation.google.contractTests.listLanguages.testTree;

adaptiveContentService.tests.utils.checkGoogleKeys(serviceKey, testTree, "List Supported Languages (Google) Contract test");
