"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordFrequency"); // providing mock data as an alternative to actual Oxford response

// mock data
var mockFrequencyData = require("../../mockData/oxford/frequency");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.general.frequency");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

/* testing grade for frequency - to override 'authenticationOptions'
 * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.dictionary.general.frequency", {
    gradeNames: ["adaptiveContentService.handlers.dictionary.general.frequency"],
    authenticationOptions: {
        "app_id": mockFrequencyData.apiKeys.correct.app_id,
        "app_key": mockFrequencyData.apiKeys.correct.app_key
    }
});

adaptiveContentService.tests.dictionary.general.frequency = [{
    name: "GET request for the Frequency dictionary endpoint",
    expect: 5,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockFrequencyData.lang.correct + "/frequency/" + mockFrequencyData.word.correct,
                method: "get"
            }
        },
        authErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockFrequencyData.lang.correct + "/frequency/" + mockFrequencyData.word.authErrorTrigger,
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockFrequencyData.lang.wrong + "/frequency/" + mockFrequencyData.word.correct,
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockFrequencyData.lang.correct + "/frequency/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
                method: "get"
            }
        },
        requestErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockFrequencyData.lang.correct + "/frequency/" + mockFrequencyData.word.requestErrorTrigger,
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
        args: ["Dictionary Tests : Frequency test for correct word successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{authErrorTest}.send"
    },
    {
        event: "{authErrorTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency test for authentication fail successful", 403, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency test for unsupported language successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency test for long uri successful", 414, "{arguments}.1.nativeResponse.statusCode"]
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
 * No wrong word test here
 * because the frequency is returned
 * 0 for them
 */

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.general.frequency);
