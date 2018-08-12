"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.yandex.listLanguagesConstructResponse");

require("../index");

adaptiveContentService.tests.translation.unitTests.yandex.listLanguagesConstructResponse = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.listLanguages.constructResponse(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockListLangData = require("../../index").mockData.yandex.listLanguages;

var testServiceResponse = {
    body: {
        langs: mockListLangData.languageObj
    }
};

var expectedReturnVal = [
    {
        name: mockListLangData.languageObj.en,
        code: "en"
    },
    {
        name: mockListLangData.languageObj.de,
        code: "de"
    }
];

var testMessage = "Unit Test : For list supported languages constructResponse function (Yandex) : Successful";

jqunit.test(
    "Unit Test : For list supported languages constructResponse function (Yandex Service)",
    function () {
        adaptiveContentService.tests.translation.unitTests.yandex.listLanguagesConstructResponse(testMessage, expectedReturnVal, testServiceResponse);
    }
);
