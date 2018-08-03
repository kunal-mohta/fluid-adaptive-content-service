"use strict";

var nock = require("nock"),
    mockPronunciationsData = require("../mockData/oxford/pronunciations");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase)
// no error
.get("/entries/" + mockPronunciationsData.lang.correct + "/" + mockPronunciationsData.word.correct)
.reply(
    200,
    mockPronunciationsData.responses.correctWord
)
// wrong word
.get("/entries/" + mockPronunciationsData.lang.correct + "/" + mockPronunciationsData.word.wrong)
.reply(
    404,
    mockPronunciationsData.responses.wrongWord
)
// wrong language
.get("/entries/" + mockPronunciationsData.lang.wrong + "/" + mockPronunciationsData.word.correct)
.reply(
    404,
    mockPronunciationsData.responses.wrongLang
)
// for requests with headers having wrong authentication keys
.get("/entries/" + mockPronunciationsData.lang.correct + "/" + mockPronunciationsData.word.authErrorTrigger)
.reply(
    403,
    mockPronunciationsData.responses.authError
)
// error making request
.get("/entries/" + mockPronunciationsData.lang.correct + "/" + mockPronunciationsData.word.requestErrorTrigger)
.reply(
    500,
    mockPronunciationsData.responses.requestError
)
.persist();
