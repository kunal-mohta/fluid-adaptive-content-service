"use strict";

var commonOxfordMockData = require("./commonMockData");

var lexicalCategory = "noun",
    frequency = 123;

module.exports = {
    // general data
    word: commonOxfordMockData.word,
    lang: commonOxfordMockData.lang,
    frequency: frequency,
    lexicalCategory: lexicalCategory,
    apiKeys: commonOxfordMockData.apiKeys,
    // responses
    responses: {
        correctWord:
        {
            result: {
                frequency: frequency,
                lemma: commonOxfordMockData.word.correct,
                lexicalCategory: lexicalCategory
            }
        },
        wrongLang: "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in zu, ro, ta, sw, de, tn, lv, id, ur, en, nso, ms, gu, pt, hi, es</p>",
        authError: commonOxfordMockData.responses.authError,
        requestError: commonOxfordMockData.responses.requestError
    }
};
