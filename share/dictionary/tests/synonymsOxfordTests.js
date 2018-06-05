"use strict";

var fluid = require("infusion");
var kettle = require("kettle");
var jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary");

fluid.logObjectRenderChars = 10000; // to ask

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary = [{
    name: "GET request for the Synonyms dictionary endpoint of Oxford Service",
    expect: 4,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "./v1/dictionary/config/"
    },
    components: {
        correctWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/en/synonyms/play",
                method: "get"
            }
        },
        wrongWordTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/en/synonyms/wrongword",
                method: "get"
            }
        },
        wrongLangTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/wrong/synonyms/word",
                method: "get"
            }
        },
        longUriTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/oxford/en/synonyms/iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{correctWordTest}.send"
    },
    {
        event: "{correctWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.correctWordHandler"
    },
    {
        func: "{wrongWordTest}.send"
    },
    {
        event: "{wrongWordTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.wrongWordHandler"
    },
    {
        func: "{wrongLangTest}.send"
    },
    {
        event: "{wrongLangTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.wrongLangHandler"
    },
    {
        func: "{longUriTest}.send"
    },
    {
        event: "{longUriTest}.events.onComplete",
        listener: "adaptiveContentService.tests.dictionary.longUriHandler"
    }
    ]
}];

//Test for the correct word
adaptiveContentService.tests.dictionary.correctWordHandler = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Definition Only test for correct word successful", 200, that.nativeResponse.statusCode);
};

//Test for the wrong word
adaptiveContentService.tests.dictionary.wrongWordHandler = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Definition Only test for wrong word successful", 404, that.nativeResponse.statusCode);
};

//Test for the unsupported language
adaptiveContentService.tests.dictionary.wrongLangHandler = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Definition Only test for unsupported language successful", 404, that.nativeResponse.statusCode);
};

//Test for long uri
adaptiveContentService.tests.dictionary.longUriHandler = function (data, that) {
    jqunit.assertEquals("Dictionary Tests : Definition Only test for long uri", 414, that.nativeResponse.statusCode);
};

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary);
