"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape");

require("../../../../../v1/dictionary/handlers/oxfordHandlers");

adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape = function (testMessage, expectedReturnVal, errResponse) {
    var returnVal = adaptiveContentService.handlers.dictionary.oxford.errorMsgScrape(errResponse);

    jqunit.assertEquals(testMessage, expectedReturnVal, returnVal);
};

var errResponse = {
    html: "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for 'wrongword' in 'en'</p>",
    nonHtml: "Error message not in HTML format"
};

var testMessage = {
    html: "Unit Test : For checkDictionary function (Oxford) : Successful with html error response",
    nonHtml: "Unit Test : For checkDictionary function (Oxford) : Successful with nonHtml error response"
};

var expectedReturnVal = {
    html: "Not Found: No entry available for 'wrongword' in 'en'",
    nonHtml: errResponse.nonHtml
};

jqunit.test(
    "Unit Test : For errorMsgScrape function (Oxford Service)",
    function () {

        // for error message in html format
        adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape(testMessage.html, expectedReturnVal.html, errResponse.html);

        // for error message in plain text format
        adaptiveContentService.tests.dictionary.oxford.unitTests.errorMsgScrape(testMessage.nonHtml, expectedReturnVal.nonHtml, errResponse.nonHtml);
    }
);
