"use strict";

var commonMockYandexData = require("../yandex/commonMockData");

module.exports = {
    // general data
    languageObj: {
        en: "English",
        de: "German"
    },
    apiKey: commonMockYandexData.apiKey,
    correctApiKey: commonMockYandexData.correctApiKey,
    // responses
    responses: {
        noError: {
            "langs": {
                "en": "English",
                "de": "German"
            }
        },
        keyInvalid: commonMockYandexData.keyInvalid,
        keyBlocked: commonMockYandexData.keyBlocked,
        limitExceeded: commonMockYandexData.limitExceeded
    }
};
