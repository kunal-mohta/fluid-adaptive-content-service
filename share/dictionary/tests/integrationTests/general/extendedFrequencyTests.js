"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordExtendedFrequency"); // providing mock data as an alternative to actual Oxford response

// mock data
var mockExtendedFrequencyData = require("../../mockData/oxford/extendedFrequency");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.general.extendedFrequency");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

/* testing grade for extended frequency - to override 'authenticationOptions'
 * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.dictionary.general.extendedFrequency", {
    gradeNames: ["adaptiveContentService.handlers.dictionary.oxford.extendedFrequency"],
    authenticationOptions: {
        "app_id": mockExtendedFrequencyData.apiKeys.correct.app_id,
        "app_key": mockExtendedFrequencyData.apiKeys.correct.app_key
    }
});

adaptiveContentService.tests.dictionary.general.extendedFrequency = [{
    name: "GET request for the Frequency (extended) dictionary endpoint",
    expect: 5,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockExtendedFrequencyData.lang.correct + "/frequency/" + mockExtendedFrequencyData.word.correct + "/" + mockExtendedFrequencyData.lexicalCategory,
                method: "get"
            }
        },
        authErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockExtendedFrequencyData.lang.correct + "/frequency/" + mockExtendedFrequencyData.word.authErrorTrigger + "/" + mockExtendedFrequencyData.lexicalCategory,
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockExtendedFrequencyData.lang.wrong + "/frequency/" + mockExtendedFrequencyData.word.correct + "/" + mockExtendedFrequencyData.lexicalCategory,
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockExtendedFrequencyData.lang.correct + "/frequency/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii/" + mockExtendedFrequencyData.lexicalCategory,
                method: "get"
            }
        },
        requestErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockExtendedFrequencyData.lang.correct + "/frequency/" + mockExtendedFrequencyData.word.requestErrorTrigger + "/" + mockExtendedFrequencyData.lexicalCategory,
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
        args: ["Dictionary Tests : Frequency (extended) test for correct word successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{authErrorTest}.send"
    },
    {
        event: "{authErrorTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency (extended) test for authentication fail successful", 403, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency (extended) test for unsupported language successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency (extended) test for long uri successful", 414, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{requestErrorTest}.send"
    },
    {
        event: "{requestErrorTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency (extended) test for error making request successful", 500, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

/*
 * No wrong word test and wrong lexical category test here
 * because the frequency is returned
 * 0 for them
 */

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.general.extendedFrequency);
