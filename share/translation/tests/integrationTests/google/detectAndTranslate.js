"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.google.detectAndTranslate");

fluid.logObjectRenderChars = kettle.resolvers.env("CHAR_LIM");

kettle.loadTestingSupport();

// mock data
var mockTranslationData = require("../../mockData/google/translation");

/* testing grade for google detect and translate text - to override 'characterLimit' configuration
 * and 'requiredData' function
 * for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.google.detectAndTranslate", {
    gradeNames: "adaptiveContentService.handlers.translation.google.detectAndTranslate",
    characterLimit: 40,
    authenticationOptions: {
        "api_key": mockTranslationData.apiKey.correct
    },
    invokers: {
        requiredData: "adaptiveContentService.test.handlers.translation.google.detectAndTranslate.requiredData"
    }
});

// TODO: make a common file for these - repeated across google tests
// function providing the required mock data (over-riding the actual function)
adaptiveContentService.test.handlers.translation.google.detectAndTranslate.requiredData = function (targetLang, text) {
    var promise = fluid.promise(),
        jsonMockResponse;

    // wrong target language response
    if (targetLang === mockTranslationData.targetLang.wrong) {
        jsonMockResponse = mockTranslationData.responses.invalidLangCode;
        promise.resolve({
            statusCode: jsonMockResponse.body.error.code,
            body: jsonMockResponse.body
        });
    }
    // wrong service key
    else if (text === mockTranslationData.text.authErrorTrigger) {
        jsonMockResponse = mockTranslationData.responses.keyInvalid;
        promise.resolve({
            statusCode: jsonMockResponse.body.error.code,
            body: jsonMockResponse.body
        });
    }
    // error making request
    else if (text === mockTranslationData.text.requestErrorTrigger) {
        jsonMockResponse = mockTranslationData.responses.requestError;
        promise.resolve(jsonMockResponse);
    }
    // no Error response
    else {
        jsonMockResponse = mockTranslationData.responses.noError;
        promise.resolve({
            statusCode: 200,
            body: jsonMockResponse
        });
    }

    return promise;
};

adaptiveContentService.tests.translation.google.detectAndTranslate = [{
    name: "POST request for the translation endpoint (with only target language given) of Google Service",
    expect: 8,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        emptyTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        absentTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        authError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        wrongTargetLang: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/translate/" + mockTranslationData.targetLang.wrong,
                method: "post"
            }
        },
        invalidTargetLangCode: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/translate/" + mockTranslationData.targetLang.invalid,
                method: "post"
            }
        },
        longTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        requestError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        }
    },
    sequence: [{
        func: "{noError}.send",
        args: { text: mockTranslationData.text.noError }
    },
    {
        event: "{noError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{emptyTextField}.send",
        args: { text: mockTranslationData.text.empty }
    },
    {
        event: "{emptyTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with empty text field", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{absentTextField}.send",
        args: { text: mockTranslationData.text.absent }
    },
    {
        event: "{absentTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with absent text field", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{authError}.send",
        args: { text: mockTranslationData.text.authErrorTrigger }
    },
    {
        event: "{authError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with wrong service key", 403, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongTargetLang}.send",
        args: { text: mockTranslationData.text.noError }
    },
    {
        event: "{wrongTargetLang}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with wrong target language", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{invalidTargetLangCode}.send",
        args: { text: mockTranslationData.text.noError }
    },
    {
        event: "{invalidTargetLangCode}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with invalid target language", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longTextField}.send",
        args: { text: mockTranslationData.text.tooLong }
    },
    {
        event: "{longTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with too long text field", 413, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{requestError}.send",
        args: { text: mockTranslationData.text.requestErrorTrigger }
    },
    {
        event: "{requestError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for error with making request", 500, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.google.detectAndTranslate);
