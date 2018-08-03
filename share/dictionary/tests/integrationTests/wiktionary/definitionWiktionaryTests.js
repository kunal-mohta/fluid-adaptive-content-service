"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.definition");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

// mock data
var mockDefinitionData = require("../../mockData/wiktionary/definitions");

/* testing grade for wiktionary definition - to override 'requiredData' function
 * for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.dictionary.wiktionary.definition", {
    gradeNames: "adaptiveContentService.handlers.dictionary.wiktionary.definition",
    invokers: {
        requiredDataImpl: "adaptiveContentService.test.handlers.dictionary.wiktionary.definition.requiredData"
    }
});

// function providing the required mock data (over-riding the actual function)
adaptiveContentService.test.handlers.dictionary.wiktionary.definition.requiredData = function (lang, word) {
    var promise = fluid.promise(),
        jsonMockResponse;

    // wrong word response
    if (word === mockDefinitionData.word.wrong) {
        jsonMockResponse = mockDefinitionData.responses.wrongWord;
        promise.resolve(jsonMockResponse);
    }
    // wrong lang response
    else if (lang === mockDefinitionData.lang.wrong) {
        jsonMockResponse = mockDefinitionData.responses.wrongWord;
        promise.resolve(jsonMockResponse);
    }
    // error making request
    else if (word === mockDefinitionData.word.requestErrorTrigger) {
        jsonMockResponse = mockDefinitionData.responses.requestError;
        promise.resolve(jsonMockResponse);
    }
    // no Error response
    else {
        jsonMockResponse = mockDefinitionData.word.correct;
        promise.resolve(mockDefinitionData.responses.correctWord);
    }

    return promise;
};

adaptiveContentService.tests.dictionary.wiktionary.definition = [{
    name: "GET request for the definition dictionary endpoint",
    expect: 5,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/" + mockDefinitionData.lang.correct + "/definition/" + mockDefinitionData.word.correct,
                method: "get"
            }
        },
        wrongWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/" + mockDefinitionData.lang.correct + "/definition/" + mockDefinitionData.word.wrong,
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/" + mockDefinitionData.lang.wrong + "/definition/" + mockDefinitionData.word.correct,
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/" + mockDefinitionData.lang.correct + "/definition/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
                method: "get"
            }
        },
        requestErrorTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/" + mockDefinitionData.lang.correct + "/definition/" + mockDefinitionData.word.requestErrorTrigger,
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
        args: ["Dictionary Tests : Definition test for correct word successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongWordTest}.send"
    },
    {
        event: "{wrongWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Definition test for wrong word successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Definition test for unsupported language successful", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Definition test for long uri successful", 414, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{requestErrorTest}.send"
    },
    {
        event: "{requestErrorTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Definition test for error making request successful", 500, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.wiktionary.definition);
