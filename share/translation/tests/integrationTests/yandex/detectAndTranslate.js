"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/yandex/mockYandexTranslation"); // providing mock data as an alternative to actual Yandex response (translation)
require("../../nock/yandex/mockYandexLangDetection"); // providing mock data as an alternative to actual Yandex response (language detection)

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.yandex.detectAndTranslate");

fluid.logObjectRenderChars = kettle.resolvers.env("CHAR_LIM");

kettle.loadTestingSupport();

// mock data (translation)
var mockTranslationData = require("../../mockData/yandex/translation");

// mock data (language detection)
var mockLangDetectionData = require("../../mockData/yandex/langDetection");

/* testing grade for yandex detect-and-translate - to override 'characterLimit' and 'authenticationOptions'
 * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.yandex.detectAndTranslate", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex.detectAndTranslate",
    characterLimit: 40,
    authenticationOptions: {
        "api_key": mockTranslationData.apiKey.correct
    }
});

adaptiveContentService.tests.translation.yandex.detectAndTranslate = [{
    name: "POST request for the translation endpoint (with only target language given) of Yandex Service",
    expect: 7,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        emptyTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        absentTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        unsupportedTranslationDirection: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.targetLang.wrong,
                method: "post"
            }
        },
        invalidTargetLangCode: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.targetLang.invalid,
                method: "post"
            }
        },
        cannotDetectLang: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        longTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.targetLang.correct,
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
        args: ["Translation Tests : language detection test for request with no errors (Yandex Service)", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{emptyTextField}.send",
        args: { text: mockLangDetectionData.text.empty }
    },
    {
        event: "{emptyTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with empty text field (Yandex Service)", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{absentTextField}.send",
        args: { text: mockLangDetectionData.text.absent }
    },
    {
        event: "{absentTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with absent text field (Yandex Service)", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{unsupportedTranslationDirection}.send",
        args: { text: mockLangDetectionData.text.noError }
    },
    {
        event: "{unsupportedTranslationDirection}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with unsupported translation direction (Yandex Service)", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{invalidTargetLangCode}.send",
        args: { text: mockLangDetectionData.text.noError }
    },
    {
        event: "{invalidTargetLangCode}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with invalid target language (Yandex Service)", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{cannotDetectLang}.send",
        args: { text: mockLangDetectionData.text.numerical }
    },
    {
        event: "{cannotDetectLang}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for 'unable to detect lang' response (Yandex Service)", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longTextField}.send",
        args: { text: mockLangDetectionData.text.tooLong }
    },
    {
        event: "{longTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with too long text field (Yandex Service)", 413, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.yandex.detectAndTranslate);
