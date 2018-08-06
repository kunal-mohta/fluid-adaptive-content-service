"use strict";

var commonOxfordMockData = require("./commonMockData");

module.exports = {
    // general data
    word: commonOxfordMockData.word,
    lang: commonOxfordMockData.lang,
    apiKeys: commonOxfordMockData.apiKeys,
    correctApiKey: commonOxfordMockData.correctApiKey,
    // responses
    responses: {
        correctWord:
        {
            results: [
                {
                    id: commonOxfordMockData.word.correct,
                    lexicalEntries: [
                        {
                            lexicalCategory: "Verb",
                            entries: [
                                {
                                    senses: [
                                        {
                                            definitions: [ "mock definition 1" ],
                                            subsenses: [
                                                {
                                                    definitions: [ "mock definition 2" ]
                                                }
                                            ]
                                        },
                                        {
                                            definitions: [ "mock definition 3" ]
                                        }
                                    ]
                                },
                                {
                                    senses: [
                                        {
                                            definitions: [ "mock definition 4" ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            lexicalCategory: "Noun",
                            entries: [
                                {
                                    senses: [
                                        {
                                            definitions: [ "mock definition 5" ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        wrongWord: "<title>404 Not Found</title><h1>Not Found</h1><p>No entry available for '" + commonOxfordMockData.word.wrong + "' in 'en'</p>",
        wrongLang: "<title>404 Not Found</title><h1>Not Found</h1><p>source_lang is not in en, es, gu, hi, lv, sw, ta</p>",
        authError: commonOxfordMockData.responses.authError,
        requestError: commonOxfordMockData.responses.requestError
    }
};
