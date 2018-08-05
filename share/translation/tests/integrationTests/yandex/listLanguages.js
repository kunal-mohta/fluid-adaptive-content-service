"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/yandex/mockListLanguages"); // providing mock data as an alternative to actual Yandex response

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.yandex.listLanguages");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

//mock data
var mockTranslationData = require("../../mockData/yandex/translation");

/* testing grade for yandex list languages - to override 'authenticationOptions'
 * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.yandex.listLanguages", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex.listLanguages",
    authenticationOptions: {
        "api_key": mockTranslationData.apiKey.correct
    }
});

adaptiveContentService.tests.translation.yandex.listLanguages = [{
    name: "GET request for the List Languages endpoint of Yandex Service",
    expect: 2,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        generalEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/languages",
                method: "get"
            }
        },
        translateTextEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/yandex/langs/translate",
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
        args: ["Translation Tests : Text Translation test for request with no errors", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{translateTextEndpoint}.send"
    },
    {
        event: "{translateTextEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with no errors for translate text endpoint", 200, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.yandex.listLanguages);
