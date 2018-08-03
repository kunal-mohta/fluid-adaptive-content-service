"use strict";

var word = {
    correct: "happy",
    wrong: "wrongWord",
    requestErrorTrigger: "triggerRequestError"
};

module.exports = {
    // general data
    word: word,
    lang: {
        correct: "en",
        wrong: "asd",
        invalid: "english" // greater than 3 letters
    },
    // responses
    responses: {
        correctWord: {
            word: word.correct,
            category: "adjective",
            definition: "This is definition of the word"
        },
        wrongWord: {
            err: "not found"
        },
        wrongLang: {
            err: "unsupported language"
        },
        requestError: {
            err: "a request has failed"
        }
    }
};
