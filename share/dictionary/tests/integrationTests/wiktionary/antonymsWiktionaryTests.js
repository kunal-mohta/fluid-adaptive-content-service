"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../index");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.antonyms");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.wiktionary.antonyms = [{
    name: "Integration Test : GET request for the Antonyms dictionary endpoint of the Wiktionary Service",
    expect: 1,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        serviceNotProvidedTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/en/antonyms/word",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{serviceNotProvidedTest}.send"
    },
    {
        event: "{serviceNotProvidedTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Antonyms test (Wiktionary) successful", 400, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.wiktionary.antonyms);
