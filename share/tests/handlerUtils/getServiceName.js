"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.handlerUtils.unitTests.getServiceName");

require("../index");

var testUrl = "/version/dictionary/serviceName/language/endpointName/word";

adaptiveContentService.tests.handlerUtils.unitTests.getServiceName = function () {
    var returnVal = adaptiveContentService.handlerUtils.getServiceName(testUrl);

    jqunit.assertEquals("Unit Test : For getServiceName function : Successful", "serviceName", returnVal);
};

jqunit.test(
    "Unit Test : For getServiceName function (Handler Utilities function)",
    function () {
        adaptiveContentService.tests.handlerUtils.unitTests.getServiceName();
    }
);
