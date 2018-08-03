"use strict";

module.exports = {
    // general data
    text: {
        noError: "This is the text to be translated",
        empty: "",
        absent: undefined,
        tooLong: "This sentence will exceed the character limit because it is very long",
        numerical: "12345",
        limitExceeded: "This test will trigger limit exceeded endpoint",
        authErrorTrigger: "triggerAuthError",
        blockedKeyErrorTrigger: "blockedKeyErrorTrigger",
        requestErrorTrigger: "triggerRequestError"
    },
    sourceLang: {
        correct: "en",
        wrong: "eng",
        invalid: "english"
    },
    targetLang: {
        correct: "de",
        wrong: "abc",
        invalid: "german"
    }
};
