"use strict";

var nock = require("nock");

require("dotenv").config();//npm package to get variables from '.env' file

var urlBase = "https://translate.yandex.net/api/v1.5/tr.json";

// mock data
var mockLangDetectionData = require("../../mockData/yandex/langDetection");

nock(urlBase)
//no error
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.correct,
    {
        text: mockLangDetectionData.text.noError
    }
)
.reply(
    200,
    mockLangDetectionData.responses.noError
)
//unable to detect lang
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.correct,
    {
        text: mockLangDetectionData.text.numerical
    }
)
.reply(
    200,
    mockLangDetectionData.responses.cannotDetect
)
// Invalid api key
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.correct,
    {
        text: mockLangDetectionData.text.authErrorTrigger
    }
)
.reply(
    401,
    mockLangDetectionData.responses.keyInvalid
)
// Blocked api key
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.correct,
    {
        text: mockLangDetectionData.text.blockedKeyErrorTrigger
    }
)
.reply(
    402,
    mockLangDetectionData.responses.keyBlocked
)
// Exceeding daily limit
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.correct,
    {
        text: mockLangDetectionData.limitExceedTriggerText
    }
)
.reply(
    404,
    mockLangDetectionData.responses.limitExceeded
)
// error with making request
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.correct,
    {
        text: mockLangDetectionData.text.requestErrorTrigger
    }
)
.reply(
    500,
    mockLangDetectionData.responses.requestError
)
.persist();
