"use strict";

/* No mock data/response is used here
 * because no request is made
 * response comes directly from the library
 */

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.nlp.compromise.sentenceTagging");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

var testRequestBody = {
    correctSentence: {
        sentence: "Hello world"
    },
    emptySentence: {},
    longSentence: {
        sentence: "This sentence exceeds the character limit because it is long"
    }
};

require("../../../../../v1/nlp/handlers");

fluid.registerNamespace("adaptiveContentService.test.handlers.nlp.compromise.sentenceTagging");

/* testing grade for compromise sentence tagging - to override 'characterLimit'   * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.nlp.compromise.sentenceTagging", {
    gradeNames: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging",
    characterLimit: 40
});

adaptiveContentService.tests.nlp.compromise.sentenceTagging = [{
    name: "GET request for the Sentence Tagging NLP endpoint",
    expect: 3,
    config: {
        configName: "nlpServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/nlp/config/"
    },
    components: {
        correctSentence: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/nlp/compromise/tags/",
                method: "post"
            }
        },
        emptySentence: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/nlp/compromise/tags/",
                method: "post"
            }
        },
        longSentence: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/nlp/compromise/tags/",
                method: "post"
            }
        }
    },
    sequence: [
        {
            func: "{correctSentence}.send",
            args: testRequestBody.correctSentence
        },
        {
            event: "{correctSentence}.events.onComplete",
            listener: "adaptiveContentService.tests.utils.assertStatusCode",
            args: ["NLP Tests : Sentence Tagging test for correct sentence successful", 200, "{arguments}.1.nativeResponse.statusCode"]
        },
        {
            func: "{emptySentence}.send",
            args: testRequestBody.emptySentence
        },
        {
            event: "{emptySentence}.events.onComplete",
            listener: "adaptiveContentService.tests.utils.assertStatusCode",
            args: ["NLP Tests : Sentence Tagging test for empty sentence successful", 400, "{arguments}.1.nativeResponse.statusCode"]
        },
        {
            func: "{longSentence}.send",
            args: testRequestBody.longSentence
        },
        {
            event: "{longSentence}.events.onComplete",
            listener: "adaptiveContentService.tests.utils.assertStatusCode",
            args: ["NLP Tests : Sentence Tagging test for long sentence successful", 413, "{arguments}.1.nativeResponse.statusCode"]
        }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.nlp.compromise.sentenceTagging);
