"use strict";

var nock = require("nock"),
    mockFrequencyData = require("../mockData/oxford/frequency");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase)
// no error
.get("/stats/frequency/word/" + mockFrequencyData.lang.correct + "/?lemma=" + mockFrequencyData.word.correct)
.reply(
    200,
    mockFrequencyData.responses.correctWord
)
// wrong language
.get("/stats/frequency/word/" + mockFrequencyData.lang.wrong + "/?lemma=" + mockFrequencyData.word.correct)
.reply(
    404,
    mockFrequencyData.responses.wrongLang
)
// for requests with headers having wrong authentication keys
.get("/stats/frequency/word/" + mockFrequencyData.lang.correct + "/?lemma=" + mockFrequencyData.word.authErrorTrigger)
.reply(
    403,
    mockFrequencyData.responses.authError
)
// error making request
.get("/stats/frequency/word/" + mockFrequencyData.lang.correct + "/?lemma=" + mockFrequencyData.word.requestErrorTrigger)
.reply(
    500,
    mockFrequencyData.responses.requestError
)
.persist();
