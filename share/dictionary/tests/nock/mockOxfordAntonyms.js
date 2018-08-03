"use strict";

var nock = require("nock"),
    mockAntonymsData = require("../mockData/oxford/antonyms");// file holding object with mock data

var urlBase = "https://od-api.oxforddictionaries.com/api/v1";

// for requests with headers having correct authentication keys
nock(urlBase)
// no errors
.get("/entries/" + mockAntonymsData.lang.correct + "/" + mockAntonymsData.word.correct + "/antonyms")
.reply(
    200,
    mockAntonymsData.responses.correctWord
)
// wrong word
.get("/entries/" + mockAntonymsData.lang.correct + "/" + mockAntonymsData.word.wrong + "/antonyms")
.reply(
    404,
    mockAntonymsData.responses.wrongWord
)
// wrong language
.get("/entries/" + mockAntonymsData.lang.wrong + "/" + mockAntonymsData.word.correct + "/antonyms")
.reply(
    404,
    mockAntonymsData.responses.wrongLang
)
// for requests with headers having wrong authentication keys
.get("/entries/" + mockAntonymsData.lang.correct + "/" + mockAntonymsData.word.authErrorTrigger + "/antonyms")
.reply(
    403,
    mockAntonymsData.responses.authError
)
// error making request
.get("/entries/" + mockAntonymsData.lang.correct + "/" + mockAntonymsData.word.requestErrorTrigger + "/antonyms")
.reply(
    500,
    mockAntonymsData.responses.requestError
)
.persist();
