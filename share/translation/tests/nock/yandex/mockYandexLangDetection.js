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
    mockLangDetectionData.noError
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
    mockLangDetectionData.cannotDetect
)
// Invalid api key
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.invalid,
    {
        text: mockLangDetectionData.text.noError
    }
)
.reply(
    401,
    mockLangDetectionData.keyInvalid
)
// Blocked api key
.post(
    "/detect?key=" + mockLangDetectionData.apiKey.blocked,
    {
        text: mockLangDetectionData.text.noError
    }
)
.reply(
    402,
    mockLangDetectionData.keyBlocked
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
    mockLangDetectionData.limitExceeded
)
.persist();