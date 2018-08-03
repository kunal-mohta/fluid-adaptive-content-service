/* Integration tests (Google) for both
 * List languages - /languages
 * Extended list languages - /languages/:lang
 */
"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.google.listLanguages");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

//mock data
var mockListLanguagesData = require("../../mockData/google/listLanguages");

/* testing grade for google listing supported languages - to override 'requiredData' function
 * for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.google.listLanguages", {
    gradeNames: "adaptiveContentService.handlers.translation.google.listLanguages",
    invokers: {
        requiredData: "adaptiveContentService.test.handlers.translation.google.listLanguages.requiredData"
    }
});

// function providing the required mock data (over-riding the actual function)
adaptiveContentService.test.handlers.translation.google.listLanguages.requiredData = function (lang) {
    var promise = fluid.promise(),
        langArray;

    // lang parameter present
    if (lang) {
        langArray = mockListLanguagesData.languageArray.french;
    }
    // lang parameter absent
    else {
        langArray = mockListLanguagesData.languageArray.english;
    }

    promise.resolve({
        statusCode: 200,
        body: langArray
    });

    return promise;
};

adaptiveContentService.tests.translation.google.listLanguages = [{
    name: "GET request for the List Languages endpoint of Google Service",
    expect: 3,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        listLanguagesNoError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/languages",
                method: "get"
            }
        },
        extendedListLanguagesNoError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/languages/" + mockListLanguagesData.langParam,
                method: "get"
            }
        },
        detectAndTranslateEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/langs/translate",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{listLanguagesNoError}.send"
    },
    {
        event: "{listLanguagesNoError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : List languages test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{extendedListLanguagesNoError}.send"
    },
    {
        event: "{extendedListLanguagesNoError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Extended List languages test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{detectAndTranslateEndpoint}.send"
    },
    {
        event: "{detectAndTranslateEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Extended List languages test for request with no errors for detect-and-translate endpoint", 200, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.google.listLanguages);
