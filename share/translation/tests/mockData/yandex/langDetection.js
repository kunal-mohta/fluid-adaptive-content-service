"use strict";

var commonMockYandexData = require("../yandex/commonMockData"),
    detectedLang = "en";

module.exports = {
    //general data
    text: commonMockYandexData.text,
    detectedLang: detectedLang,
    apiKey: commonMockYandexData.apiKey,
    //responses
    responses: {
        noError: {
            "code": 200,
            "lang": detectedLang
        },
        cannotDetect: {
            "code": 200,
            "lang": ""
        },
        keyInvalid: commonMockYandexData.responses.keyInvalid,
        keyBlocked: commonMockYandexData.responses.keyBlocked,
        limitExceeded: commonMockYandexData.responses.limitExceeded,
        requestError: commonMockYandexData.responses.requestError
    }
};
