"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.google.langDetection");

fluid.logObjectRenderChars = kettle.resolvers.env("CHAR_LIM");

kettle.loadTestingSupport();

//mock data
var mockLangDetectionData = require("../../mockData/google/langDetection");

/* testing grade for google lang detection - to override 'characterLimit' configuration
 * and 'requiredData' function
 * for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.google.langDetection", {
    gradeNames: "adaptiveContentService.handlers.translation.google.langDetection",
    characterLimit: 40,
    invokers: {
        requiredData: "adaptiveContentService.test.handlers.translation.google.langDetection.requiredData"
    }
});

// function providing the required mock data (over-riding the actual function)
adaptiveContentService.test.handlers.translation.google.langDetection.requiredData = function (text) {
    var promise = fluid.promise(),
        jsonMockResponse;

    // cannot detect the language response
    if (text === mockLangDetectionData.text.numerical) {
        jsonMockResponse = mockLangDetectionData.responses.cannotDetect;
        promise.resolve({
            statusCode: 200,
            body: jsonMockResponse
        });
    }
    // wrong service key
    else if (text === mockLangDetectionData.text.authErrorTrigger) {
        jsonMockResponse = mockLangDetectionData.responses.keyInvalid;
        promise.resolve({
            statusCode: jsonMockResponse.body.error.code,
            body: jsonMockResponse.body
        });
    }
    // error making request
    else if (text === mockLangDetectionData.text.requestErrorTrigger) {
        jsonMockResponse = mockLangDetectionData.responses.requestError;
        promise.resolve(jsonMockResponse);
    }
    // no Error response
    else {
        jsonMockResponse = mockLangDetectionData.responses.noError;
        promise.resolve({
            statusCode: 200,
            body: jsonMockResponse
        });
    }

    return promise;
};

adaptiveContentService.tests.translation.google.langDetection = [{
    name: "POST request for the Language detection endpoint of Google Service",
    expect: 7,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        emptyTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        absentTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        authError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect/",
                method: "post"
            }
        },
        cannotDetectLang: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        longTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        requestError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        }
    },
    sequence: [{
        func: "{noError}.send",
        args: { text: mockLangDetectionData.text.noError }
    },
    {
        event: "{noError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{emptyTextField}.send",
        args: { text: mockLangDetectionData.text.empty }
    },
    {
        event: "{emptyTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with empty text field", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{absentTextField}.send",
        args: { text: mockLangDetectionData.text.absent }
    },
    {
        event: "{absentTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with too long text field", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{authError}.send",
        args: { text: mockLangDetectionData.text.authErrorTrigger }
    },
    {
        event: "{authError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with wrong service key", 403, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{cannotDetectLang}.send",
        args: { text: mockLangDetectionData.text.numerical }
    },
    {
        event: "{cannotDetectLang}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for 'unable to detect lang' response", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longTextField}.send",
        args: { text: mockLangDetectionData.text.tooLong }
    },
    {
        event: "{longTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with absent text field", 413, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{requestError}.send",
        args: { text: mockLangDetectionData.text.requestErrorTrigger }
    },
    {
        event: "{requestError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for error with making request", 500, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.google.langDetection);
