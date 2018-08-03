"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/yandex/mockYandexTranslation"); // providing mock data as an alternative to actual Yandex response

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.yandex.translateText");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

//mock data
var mockTranslationData = require("../../mockData/yandex/translation");

/* testing grade for yandex text translation - to override 'characterLimit'
 * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.yandex.translateText", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex.translateText",
    characterLimit: 40
});

adaptiveContentService.tests.translation.yandex.translateText = [{
    name: "POST request for the Text Translation endpoint of Yandex Service",
    expect: 10,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        emptyTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        absentTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        blockedApiKey: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        wrongApiKey: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        unsupportedTranslationDirection: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.wrong + "-" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        invalidSourceLangCode: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.invalid + "-" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        invalidTargetLangCode: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.invalid,
                method: "post"
            }
        },
        longTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
                method: "post"
            }
        },
        requestError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/translate/" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
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
        args: ["Translation Tests : Text Translation test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{emptyTextField}.send",
        args: { text: mockTranslationData.text.empty }
    },
    {
        event: "{emptyTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with empty text field", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{absentTextField}.send",
        args: { text: mockTranslationData.text.absent }
    },
    {
        event: "{absentTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with absent text field", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{blockedApiKey}.send",
        args: { text: mockTranslationData.text.blockedKeyErrorTrigger }
    },
    {
        event: "{blockedApiKey}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with blocked api key", 402, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongApiKey}.send",
        args: { text: mockTranslationData.text.authErrorTrigger }
    },
    {
        event: "{wrongApiKey}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with wrong api key", 403, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{unsupportedTranslationDirection}.send",
        args: { text: mockTranslationData.text.noError }
    },
    {
        event: "{unsupportedTranslationDirection}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with unsupported translation direction", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{invalidSourceLangCode}.send",
        args: { text: mockTranslationData.text.noError }
    },
    {
        event: "{invalidSourceLangCode}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with invalid source language", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{invalidTargetLangCode}.send",
        args: { text: mockTranslationData.text.noError }
    },
    {
        event: "{invalidTargetLangCode}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with invalid target language", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longTextField}.send",
        args: { text: mockTranslationData.text.tooLong }
    },
    {
        event: "{longTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with too long text field", 413, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{requestError}.send",
        args: { text: mockTranslationData.text.requestErrorTrigger }
    },
    {
        event: "{requestError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for error with making request", 500, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.yandex.translateText);
