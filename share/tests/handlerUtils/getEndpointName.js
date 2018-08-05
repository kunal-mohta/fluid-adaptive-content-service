"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.handlerUtils.unitTests.getEndpointName");

require("../../handlerUtils");

var testUrl = "/version/dictionary/wiktionary/language/endpointName/word";

adaptiveContentService.tests.handlerUtils.unitTests.getEndpointName = function () {
    var returnVal = adaptiveContentService.handlerUtils.getEndpointName(testUrl);

    jqunit.assertEquals("Unit Test : For getEndpointName function : Successful", "endpointName", returnVal);
};

jqunit.test(
    "Unit Test : For getEndpointName function (Handler Utilities function)",
    function () {
        adaptiveContentService.tests.handlerUtils.unitTests.getEndpointName();
    }
);
