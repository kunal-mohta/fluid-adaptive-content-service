"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordListLanguages"); // providing mock data as an alternative to actual Oxford response

// mock data
var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.listLanguages");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.oxford.listLanguages = [{
    name: "GET request for the list supported languages endpoint",
    expect: 6,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        generalEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/languages",
                method: "get"
            }
        },
        definitionEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/langs/definition",
                method: "get"
            }
        },
        synonymsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/langs/synonyms",
                method: "get"
            }
        },
        antonymsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/langs/antonyms",
                method: "get"
            }
        },
        pronunciationsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/langs/pronunciations",
                method: "get"
            }
        },
        frequencyEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/langs/frequency",
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
        args: ["Dictionary Tests : List languages test for no error response successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{definitionEndpoint}.send"
    },
    {
        event: "{definitionEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test for no error response for definition endpoint successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{synonymsEndpoint}.send"
    },
    {
        event: "{synonymsEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test for no error response for synonyms endpoint successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{antonymsEndpoint}.send"
    },
    {
        event: "{antonymsEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test for no error response for antonyms endpoint successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{pronunciationsEndpoint}.send"
    },
    {
        event: "{pronunciationsEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test for no error response for pronunciations endpoint successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{frequencyEndpoint}.send"
    },
    {
        event: "{frequencyEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : List languages test for no error response for frequency endpoint successful", 200, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.oxford.listLanguages);
