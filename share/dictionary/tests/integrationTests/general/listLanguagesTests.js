"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/mockOxfordListLanguages"); // providing mock data as an alternative to actual Oxford response

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.general.listLanguages");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.general.listLanguages = [{
    name: "GET request for the List supported languages dictionary endpoint",
    expect: 5,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        definitionEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/langs/definition",
                method: "get"
            }
        },
        synonymsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/langs/synonyms",
                method: "get"
            }
        },
        antonymsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/langs/antonyms",
                method: "get"
            }
        },
        pronunciationsEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/langs/pronunciations",
                method: "get"
            }
        },
        frequencyEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/langs/frequency",
                method: "get"
            }
        }
    },
    sequence: [{
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

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.general.listLanguages);
