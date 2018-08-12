"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../index");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.listLanguages");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.wiktionary.listLanguages = [{
    name: "GET request for the List Languages endpoint of Wiktionary Service",
    expect: 6,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        generalEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/languages",
                method: "get"
            }
        },
        definitionEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/langs/definition",
                method: "get"
            }
        },
        synonymsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/langs/synonyms",
                method: "get"
            }
        },
        antonymsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/langs/antonyms",
                method: "get"
            }
        },
        pronunciationsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/langs/pronunciations",
                method: "get"
            }
        },
        frequencyEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/langs/frequency",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{generalEndpoint}.send"
    },
    {
        event: "{generalEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test (Wiktionary) for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{definitionEndpoint}.send"
    },
    {
        event: "{definitionEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test (Wiktionary) for no error response for definition endpoint successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{synonymsEndpoint}.send"
    },
    {
        event: "{synonymsEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test (Wiktionary) for no error response for synonyms endpoint successful", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{antonymsEndpoint}.send"
    },
    {
        event: "{antonymsEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test (Wiktionary) for no error response for antonyms endpoint successful", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{pronunciationsEndpoint}.send"
    },
    {
        event: "{pronunciationsEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test (Wiktionary) for no error response for pronunciations endpoint successful", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{frequencyEndpoint}.send"
    },
    {
        event: "{frequencyEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test (Wiktionary) for no error response for frequency endpoint successful", 400, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.wiktionary.listLanguages);
