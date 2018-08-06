"use strict";

var googleCommonMockData = require("./commonMockData");

module.exports = {
    langParam: "fr",
    languageArray: {
        // in french
        french: [
            {
                language: "en",
                name: "Anglais"
            },
            {
                language: "de",
                name: "Allemand"
            }
        ],
        // in english
        english: [
            {
                language: "en",
                name: "English"
            },
            {
                language: "de",
                name: "German"
            }
        ]
    },
    apiKey: googleCommonMockData.apiKey,
    correctApiKey: googleCommonMockData.correctApiKey,
    // responses
    responses: {
        noError: {
            // in french
            french: [
                {
                    code: "en",
                    name: "Anglais"
                },
                {
                    code: "de",
                    name: "Allemand"
                }
            ],
            // in english
            english: [
                {
                    code: "en",
                    name: "Anglais"
                },
                {
                    code: "de",
                    name: "Allemand"
                }
            ]
        },
        keyInvalid: googleCommonMockData.responses.keyInvalid
    }
};
