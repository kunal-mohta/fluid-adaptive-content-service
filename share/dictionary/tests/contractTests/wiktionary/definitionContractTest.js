"use strict";

var fluid = require("infusion"),
    wd = require("word-definition");

require("../index");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition");

// grade getting us data from the wiktionary service
fluid.defaults("adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition.getData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        }
    }
});

adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition.getData = function (word, lang, that) {
    wd.getDef(word, lang, null, function (data) {
        that.events.onDataReceive.fire(data);
    });
};

// Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition"
        },
        // test driver
        tester: {
            type: "adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition.tester"
        }
    }
});

var correctWord = "word",
    correctLang = "en",
    wrongWord = "wrongWord",
    wrongLang = "wrongLang";

var definitionSchemas = require("./schemas/definitionSchemas"), //main schema to be compiled
    allSchemas = []; // array of all schemas required (other than main schema)

var successMessage = {
    correctWord: "Contract Test : For definitions with correct word and language successful (Wiktionary Service)",
    wrongWord: "Contract Test : For definitions with wrong word successful (Wiktionary Service)",
    wrongLang: "Contract Test : For definitions with wrong language successful (Wiktionary Service)"
};

var failureMessage = {
    correctWord: "Contract Test : For definitions with correct word and language failed (Wiktionary Service)",
    wrongWord: "Contract Test : For definitions with wrong word failed (Wiktionary Service)",
    wrongLang: "Contract Test : For definitions with wrong language failed (Wiktionary Service)"
};

// Test driver
fluid.defaults("adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For definitions (Wiktionary Service)",
        tests: [
            {
                expect: 3,
                name: "Contract Tests : For definitions (Wiktionary Service)",
                sequence: [
                    // for correct word
                    {
                        func: "{testComponent}.requestForData",
                        args: [correctWord, correctLang]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", definitionSchemas.correctWord, allSchemas, successMessage.correctWord, failureMessage.correctWord]
                    },
                    // for wrong word
                    {
                        func: "{testComponent}.requestForData",
                        args: [wrongWord, correctLang]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", definitionSchemas.wrongWord, allSchemas, successMessage.wrongWord, failureMessage.wrongWord]
                    },
                    // for wrong language
                    {
                        func: "{testComponent}.requestForData",
                        args: [correctWord, wrongLang]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", definitionSchemas.wrongLang, allSchemas, successMessage.wrongLang, failureMessage.wrongLang]
                    }
                ]
            }
        ]
    }]
});

adaptiveContentService.tests.dictionary.wiktionary.contractTests.definition.testTree();
