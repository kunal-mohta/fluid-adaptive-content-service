"use strict";

var commonOxfordMockData = require("./commonMockData");

var frequency = 10;

module.exports = {
    // general data
    word: commonOxfordMockData.word,
    lang: commonOxfordMockData.lang,
    frequency: frequency,
    apiKeys: commonOxfordMockData.apiKeys,
    correctApiKey: commonOxfordMockData.correctApiKey,
    // responses
    responses: {
        correctWord:
        {
            result: {
                frequency: frequency,
                lemma: commonOxfordMockData.word.correct
            }
        },
        wrongLang: "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in zu, ro, ta, sw, de, tn, lv, id, ur, en, nso, ms, gu, pt, hi, es</p>",
        authError: commonOxfordMockData.responses.authError,
        requestError: commonOxfordMockData.responses.requestError
    }
};
