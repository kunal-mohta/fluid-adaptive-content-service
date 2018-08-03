"use strict";

var nock = require("nock"),
    mockSynonymsData = require("../mockData/oxford/synonyms");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase)
// no error
.get("/entries/" + mockSynonymsData.lang.correct + "/" + mockSynonymsData.word.correct + "/synonyms")
.reply(
    200,
    mockSynonymsData.responses.correctWord
)
// wrong word
.get("/entries/" + mockSynonymsData.lang.correct + "/" + mockSynonymsData.word.wrong + "/synonyms")
.reply(
    404,
    mockSynonymsData.responses.wrongWord
)
// wrong language
.get("/entries/" + mockSynonymsData.lang.wrong + "/" + mockSynonymsData.word.correct + "/synonyms")
.reply(
    404,
    mockSynonymsData.responses.wrongLang
)
// for requests with headers having wrong authentication keys
.get("/entries/" + mockSynonymsData.lang.correct + "/" + mockSynonymsData.word.authErrorTrigger + "/synonyms")
.reply(
    403,
    mockSynonymsData.responses.authError
)
// error making request
.get("/entries/" + mockSynonymsData.lang.correct + "/" + mockSynonymsData.word.requestErrorTrigger + "/synonyms")
.reply(
    500,
    mockSynonymsData.responses.requestError
)
.persist();
