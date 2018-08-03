"use strict";

var googleCommonMockData = require("./commonMockData");

module.exports = {
    // general data
    text: googleCommonMockData.text,
    sourceLang: googleCommonMockData.sourceLang,
    targetLang: googleCommonMockData.targetLang,
    apiKey: googleCommonMockData.apiKey,
    // responses
    responses: {
        noError: {
            "detectedSourceLanguage": googleCommonMockData.sourceLang.correct,
            "originalText": googleCommonMockData.text.noError,
            "translatedText": "Dies ist der zu übersetzende Text"
        },
        keyInvalid: googleCommonMockData.responses.keyInvalid,
        invalidLangCode: {
            "body": {
                "error": {
                    "code": 400,
                    "message": "Invalid Value"
                }
            }
        },
        requestError: googleCommonMockData.responses.requestError
    }
};
