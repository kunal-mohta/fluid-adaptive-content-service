"use strict";

var kettle = require("kettle");

var commonMockYandexData = require("../yandex/commonMockData");

module.exports = {
    // general data
    text: commonMockYandexData.text,
    sourceLang: commonMockYandexData.sourceLang,
    targetLang: commonMockYandexData.targetLang,
    apiKey: {
        correct: kettle.resolvers.env("YANDEX_API_KEY"),
        invalid: "randomstring",
        blocked: "blockedkey" //not actually blocked; used for mock response only
    },
    // responses
    responses: {
        noError: {
            "code": 200,
            "lang": commonMockYandexData.sourceLang.correct + "-" + commonMockYandexData.targetLang.correct,
            "text": [ "Dies ist der text, der übersetzt werden" ]
        },
        keyInvalid: commonMockYandexData.responses.keyInvalid,
        keyBlocked: commonMockYandexData.responses.keyBlocked,
        limitExceeded: commonMockYandexData.responses.limitExceeded,
        unsupportedTranslation: commonMockYandexData.responses.unsupportedTranslation,
        invalidLangCode: commonMockYandexData.responses.invalidLangCode,
        requestError: commonMockYandexData.responses.requestError
    }
};
