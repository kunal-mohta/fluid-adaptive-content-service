"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.handlerUtils.unitTests.checkLanguageCodes");

require("../../handlerUtils");

adaptiveContentService.tests.handlerUtils.unitTests.checkLanguageCodes = function (testMessage, expectedReturnVal, testLangObj) {
    var returnVal = adaptiveContentService.handlerUtils.checkLanguageCodes(testLangObj);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

var langObjs = {
    absent: false,
    sourceLangInvalid: {
        source: {
            name: "sourceLang",
            value: "english"
        }
    },
    targetLangInvalid: {
        target: {
            name: "targetLang",
            value: "german"
        }
    },
    bothValid: {
        source: {
            name: "sourceLang",
            value: "en"
        },
        target: {
            name: "targetLang",
            value: "de"
        }
    },
    localizedValid: {
        local: {
            name: "sourceLang",
            value: "zh-CN"
        }
    },
    localizedInvalid: {
        local: {
            name: "sourceLang",
            value: "zh-ABCD"
        }
    }
};

var expectedReturnVal = {
    langObjAbsent: false,
    sourceLangInvalid: {
        statusCode: 404,
        errorMessage: "Invalid 'sourceLang' parameter - Please check the language code"
    },
    targetLangInvalid: {
        statusCode: 404,
        errorMessage: "Invalid 'targetLang' parameter - Please check the language code"
    },
    bothValid: false,
    localizedValid: false,
    localizedInvalid: {
        statusCode: 404,
        errorMessage: "Invalid 'sourceLang' parameter - Please check the language code"
    }
};

var testMessage = {
    langObjAbsent: "Unit Test : For checkLanguageCodes function : Successful with langObj absent",
    sourceLangInvalid: "Unit Test : For checkLanguageCodes function : Successful with invalid sourceLang",
    targetLangInvalid: "Unit Test : For checkLanguageCodes function : Successful with invalid targetLang",
    bothValid: "Unit Test : For checkLanguageCodes function : Successful with both sourceLang and targetLang valid",
    localizedValid: "Unit Test : For checkLanguageCodes function : Successful with localized language code valid",
    localizedInvalid: "Unit Test : For checkLanguageCodes function : Successful with localized language code invalid"
};

jqunit.test(
    "Unit Test : For checkLanguageCodes function (Translation Service)",
    function () {

        // for absent langObj
        adaptiveContentService.tests.handlerUtils.unitTests.checkLanguageCodes(testMessage.langObjAbsent, expectedReturnVal.langObjAbsent, langObjs.absent);

        // for invalid sourceLang
        adaptiveContentService.tests.handlerUtils.unitTests.checkLanguageCodes(testMessage.sourceLangInvalid, expectedReturnVal.sourceLangInvalid, langObjs.sourceLangInvalid);

        // for invalid targetLang
        adaptiveContentService.tests.handlerUtils.unitTests.checkLanguageCodes(testMessage.targetLangInvalid, expectedReturnVal.targetLangInvalid, langObjs.targetLangInvalid);

        // for both sourceLang and targetLang valid
        adaptiveContentService.tests.handlerUtils.unitTests.checkLanguageCodes(testMessage.bothValid, expectedReturnVal.bothValid, langObjs.bothValid);

        // for valid localized lang code
        adaptiveContentService.tests.handlerUtils.unitTests.checkLanguageCodes(testMessage.localizedValid, expectedReturnVal.localizedValid, langObjs.localizedValid);

        // for invalid localized lang code
        adaptiveContentService.tests.handlerUtils.unitTests.checkLanguageCodes(testMessage.localizedInvalid, expectedReturnVal.localizedInvalid, langObjs.localizedInvalid);
    }
);
