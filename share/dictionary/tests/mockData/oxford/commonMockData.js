"use strict";

var kettle = require("kettle");
require("dotenv").config();// npm package to get variables from '.env' file

module.exports = {
    word: {
        correct: "happy",
        wrong: "wrongWord",
        authErrorTrigger: "triggerAuthErr", // trigger mock servers to give an auth error response
        requestErrorTrigger: "triggerRequestError" // trigger mock servers to give a request error response
    },
    lang: {
        correct: "en",
        wrong: "asd",
        invalid: "english" // greater than 3 letters
    },
    apiKeys: {
        correct: {
            "app_id": kettle.resolvers.env("OXFORD_APP_ID"),
            "app_key": kettle.resolvers.env("OXFORD_APP_KEY")
        },
        wrong: {
            "app_id": "randomstring",
            "app_key": "randomstring"
        }
    },
    // responses
    responses: {
        authError: "Authentication failed",
        requestError: {
            statusCode: 500,
            body: "Internal server error : Error with making request to the external service"
        }
    }
};
