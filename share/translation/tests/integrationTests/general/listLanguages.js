"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../../../testUtils");

require("../../nock/yandex/mockListLanguages"); // providing mock data as an alternative to actual Yandex response

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.general.translateText");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

/* testing grade for text translation - to override 'characterLimit'
 * configuration for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.general.translateText", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex.translateText",
    characterLimit: 40
});

adaptiveContentService.tests.translation.general.translateText = [{
    name: "POST request for the Text Translation endpoint",
    expect: 1,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        textTranslateEndpoint: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/langs/translate/",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{textTranslateEndpoint}.send"
    },
    {
        event: "{textTranslateEndpoint}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : Text Translation test for request with no errors for text translate endpoint", 200, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.general.translateText);
