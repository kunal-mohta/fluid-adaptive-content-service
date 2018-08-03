"use strict";

var nock = require("nock"),
    mockDefinitionsData = require("../mockData/oxford/definitions");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase)
// no error
.get("/entries/" + mockDefinitionsData.lang.correct + "/" + mockDefinitionsData.word.correct)
.reply(
    200,
    mockDefinitionsData.responses.correctWord
)
// wrong word
.get("/entries/" + mockDefinitionsData.lang.correct + "/" + mockDefinitionsData.word.wrong)
.reply(
    404,
    mockDefinitionsData.responses.wrongWord
)
// wrong language
.get("/entries/" + mockDefinitionsData.lang.wrong + "/" + mockDefinitionsData.word.correct)
.reply(
    404,
    mockDefinitionsData.responses.wrongLang
)
// for requests with headers having wrong authentication keys
.get("/entries/" + mockDefinitionsData.lang.correct + "/" + mockDefinitionsData.word.authErrorTrigger)
.reply(
    403,
    mockDefinitionsData.responses.authError
)
// error making request
.get("/entries/" + mockDefinitionsData.lang.correct + "/" + mockDefinitionsData.word.requestErrorTrigger)
.reply(
    500,
    mockDefinitionsData.responses.requestError
)
.persist();
