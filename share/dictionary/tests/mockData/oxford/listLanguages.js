"use strict";

var commonOxfordMockData = require("./commonMockData");

module.exports = {
    // general data
    apiKeys: commonOxfordMockData.apiKeys,
    // responses
    responses: {
        noError: {
            results: [
                {
                    sourceLanguage: {
                        id: "en",
                        language: "English"
                    },
                    type: "monolingual"
                },
                {
                    sourceLanguage: {
                        id: "en",
                        language: "English"
                    },
                    targetLanguage: {
                        id: "de",
                        language: "German"
                    },
                    type: "monolingual"
                },
                {
                    sourceLanguage: {
                        id: "de",
                        language: "German"
                    },
                    type: "monolingual"
                }
            ]
        },
        authError: commonOxfordMockData.responses.authError,
        requestError: commonOxfordMockData.responses.requestError
    }
};
