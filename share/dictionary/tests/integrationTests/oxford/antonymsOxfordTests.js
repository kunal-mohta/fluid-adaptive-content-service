"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../index");

require("../index").nock.oxford.antonyms; // providing mock data as an alternative to actual Oxford response

// mock data
var mockAntonymsData = require("../../index").mockData.oxford.antonyms;

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.antonyms");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

/* testing grade for oxford antonyms - to override 'authenticationOptions'
 * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.dictionary.oxford.antonyms", {
    gradeNames: ["adaptiveContentService.handlers.dictionary.oxford.antonyms"],
    authenticationOptions: {
        "app_id": mockAntonymsData.apiKeys.correct.app_id,
        "app_key": mockAntonymsData.apiKeys.correct.app_key
    }
});

adaptiveContentService.tests.dictionary.oxford.antonyms = [{
    name: "GET request for the Antonyms dictionary endpoint of Oxford Service",
    expect: 6,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockAntonymsData.lang.correct + "/antonyms/" + mockAntonymsData.word.correct,
                method: "get"
            }
        },
        authErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockAntonymsData.lang.correct + "/antonyms/" + mockAntonymsData.word.authErrorTrigger,
                method: "get"
            }
        },
        wrongWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockAntonymsData.lang.correct + "/antonyms/" + mockAntonymsData.word.wrong,
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockAntonymsData.lang.wrong + "/antonyms/" + mockAntonymsData.word.correct,
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockAntonymsData.lang.correct + "/antonyms/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
                method: "get"
            }
        },
        requestErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockAntonymsData.lang.correct + "/antonyms/" + mockAntonymsData.word.requestErrorTrigger,
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{correctWordTest}.send"
    },
    {
        event: "{correctWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test (Oxford) for correct word successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{authErrorTest}.send"
    },
    {
        event: "{authErrorTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test (Oxford) for authentication fail successful", 403, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongWordTest}.send"
    },
    {
        event: "{wrongWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test (Oxford) for wrong word successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test (Oxford) for unsupported language successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test (Oxford) for long uri successful", 414, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{requestErrorTest}.send"
    },
    {
        event: "{requestErrorTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test (Oxford) for error making request successful", 500, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.oxford.antonyms);
