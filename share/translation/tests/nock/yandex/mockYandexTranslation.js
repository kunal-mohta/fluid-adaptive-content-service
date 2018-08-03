"use strict";

var nock = require("nock");

require("dotenv").config();//npm package to get variables from '.env' file

var urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

// mock data
var mockTranslationData = require("../../mockData/yandex/translation");

nock(urlBase)
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    200,
    mockTranslationData.responses.noError
)
// Invalid api key
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.authErrorTrigger
    }
)
.reply(
    401,
    mockTranslationData.responses.keyInvalid
)
// Blocked api key
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.blockedKeyErrorTrigger
    }
)
.reply(
    402,
    mockTranslationData.responses.keyBlocked
)
// Exceeding daily limit
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.limitExceed
    }
)
.reply(
    404,
    mockTranslationData.responses.limitExceeded
)
// error with making request
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.requestErrorTrigger
    }
)
.reply(
    500,
    mockTranslationData.responses.requestError
)
//translation direction not supported (wrong source lang)
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.wrong + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    501,
    mockTranslationData.responses.unsupportedTranslation
)
//translation direction not supported (wrong target lang)
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.correct + "-" + mockTranslationData.targetLang.wrong,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    501,
    mockTranslationData.responses.unsupportedTranslation
)
//invalid source lang code
.post(
    "/translate?key=" + mockTranslationData.apiKey.correct + "&lang=" + mockTranslationData.sourceLang.invalid + "-" + mockTranslationData.targetLang.correct,
    {
        text: mockTranslationData.text.noError
    }
)
.reply(
    502,
    mockTranslationData.responses.invalidLangCode
)
.persist();
