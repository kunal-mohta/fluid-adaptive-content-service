"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordSynonyms"); // providing mock data as an alternative to actual Oxford response

// mock data
var mockSynonymsData = require("../../mockData/oxford/synonyms");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.synonyms");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

/* testing grade for oxford synonyms - to override 'authenticationOptions'
 * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.dictionary.oxford.synonyms", {
    gradeNames: ["adaptiveContentService.handlers.dictionary.oxford.synonyms"],
    authenticationOptions: {
        "app_id": mockSynonymsData.apiKeys.correct.app_id,
        "app_key": mockSynonymsData.apiKeys.correct.app_key
    }
});

adaptiveContentService.tests.dictionary.oxford.synonyms = [{
    name: "GET request for the Synonyms dictionary endpoint of Oxford Service",
    expect: 6,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockSynonymsData.lang.correct + "/synonyms/" + mockSynonymsData.word.correct,
                method: "get"
            }
        },
        authErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/" + mockSynonymsData.lang.correct + "/synonyms/" + mockSynonymsData.word.authErrorTrigger,
                method: "get"
            }
        },
        wrongWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockSynonymsData.lang.correct + "/synonyms/" + mockSynonymsData.word.wrong,
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockSynonymsData.lang.wrong + "/synonyms/" + mockSynonymsData.word.correct,
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockSynonymsData.lang.correct + "/synonyms/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
                method: "get"
            }
        },
        requestErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/" + mockSynonymsData.lang.correct + "/synonyms/" + mockSynonymsData.word.requestErrorTrigger,
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
        args: ["Dictionary Tests : Synonyms test for correct word successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{authErrorTest}.send"
    },
    {
        event: "{authErrorTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Synonyms test for authentication fail successful", 403, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongWordTest}.send"
    },
    {
        event: "{wrongWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Synonyms test for correct word successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Synonyms test for correct word successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Synonyms test for correct word successful", 414, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{requestErrorTest}.send"
    },
    {
        event: "{requestErrorTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Synonyms test for error making request successful", 500, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.oxford.synonyms);
