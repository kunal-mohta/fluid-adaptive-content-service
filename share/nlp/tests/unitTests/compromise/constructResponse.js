"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.nlp.compromise.unitTests.constructResponse");

require("../index");

var sentence = "This is correct sentence",
    serviceTags = [
        {
            text: "This",
            normal: "this",
            tags: [ "TitleCase", "Determiner" ]
        },
        {
            text: "is",
            normal: "is",
            tags: [ "Copula", "Verb", "VerbPhrase" ]
        },
        {
            text: "correct",
            normal: "correct",
            tags: [ "Adjective" ]
        },
        {
            text: "sentence",
            normal: "sentence",
            tags: [ "Noun", "Singular" ]
        }
    ];

adaptiveContentService.tests.nlp.compromise.unitTests.constructResponse = function () {
    var returnVal = adaptiveContentService.handlers.nlp.compromise.sentenceTagging.constructResponse(sentence, serviceTags);

    var expectedReturnVal = {
        sentence: "This is correct sentence",
        termsArray: [
            "This",
            "is",
            "correct",
            "sentence"
        ],
        tagsArray: [
            [
                "TitleCase",
                "Determiner"
            ],
            [
                "Copula",
                "Verb",
                "VerbPhrase"
            ],
            [
                "Adjective"
            ],
            [
                "Noun",
                "Singular"
            ]
        ]
    };

    jqunit.assertDeepEq("Unit Test : For constructResponse function (Compromise) : Successful", expectedReturnVal, returnVal);
};

jqunit.test(
    "Unit Test : For constructResponse function (Compromise Service)",
    function () {
        adaptiveContentService.tests.nlp.compromise.unitTests.constructResponse();
    }
);
