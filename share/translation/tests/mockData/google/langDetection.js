"use strict";

var googleCommonMockData = require("./commonMockData"),
    detectedLang = "en";

module.exports = {
    //general data
    text: googleCommonMockData.text,
    detectedLang: detectedLang,
    apiKey: googleCommonMockData.apiKey,
    //responses
    responses: {
        noError: {
            "originalText": googleCommonMockData.text.noError,
            "language": detectedLang
        },
        cannotDetect: {
            "language": "und"
        },
        keyInvalid: googleCommonMockData.responses.keyInvalid,
        requestError: googleCommonMockData.responses.requestError
    }
};
