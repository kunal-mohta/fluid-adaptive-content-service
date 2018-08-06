"use strict";

var commonMockTranslationData = require("../common/translation"),
    kettle = require("kettle");

module.exports = {
    // general data
    text: commonMockTranslationData.text,
    sourceLang: commonMockTranslationData.sourceLang,
    targetLang: commonMockTranslationData.targetLang,
    apiKey: {
        correct: "correctGoogleApiKey",
        invalid: "randomstring",
        blocked: "blockedkey" // not actually blocked; used for mock response only
    },
    // for contract tests
    correctApiKey: kettle.resolvers.env("GOOGLE_API_KEY"),
    // responses
    responses: {
        keyInvalid: {
            "body": {
                "error": {
                    "code": 400,
                    "message": "API key not valid. Please pass a valid API key."
                }
            }
        },
        requestError: {
            statusCode: 500,
            body: {
                message: "Internal Server Error : Error with making request to the external service"
            }
        }
    }
};
