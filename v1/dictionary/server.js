"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

fluid.defaults("adaptiveContentService.dictionary.serverConfig", {
    gradeNames: "fluid.component",
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8081,
                components: {
                    versionCheck: {
                        "type": "adaptiveContentService.middleware.versionCheck"
                    },
                    setResponseHeaders: {
                        "type": "adaptiveContentService.middleware.setResponseHeaders"
                    },
                    app: {
                        type: "kettle.app",
                        options: {
                            requestHandlers: {
                                generalDefinitionHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.definition",
                                    "route": "/:version/dictionary/:language/definition/:word",
                                    "method": "get"
                                },
                                generalDefinitionLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.listLanguages",
                                    "route": "/:version/dictionary/langs/definition",
                                    "method": "get"
                                },
                                generalSynonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.synonyms",
                                    "route":  "/:version/dictionary/:language/synonyms/:word",
                                    "method": "get"
                                },
                                generalSynonymsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route":  "/:version/dictionary/langs/synonyms",
                                    "method": "get"
                                },
                                generalAntonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.antonyms",
                                    "route":  "/:version/dictionary/:language/antonyms/:word",
                                    "method": "get"
                                },
                                generalAntonymsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route":  "/:version/dictionary/langs/antonyms",
                                    "method": "get"
                                },
                                generalPronunciationsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.pronunciations",
                                    "route": "/:version/dictionary/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                generalPronunciationsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route": "/:version/dictionary/langs/pronunciations",
                                    "method": "get"
                                },
                                generalFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/:language/frequency/:word",
                                    "method": "get"
                                },
                                generalFrequencyLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route": "/:version/dictionary/langs/frequency",
                                    "method": "get"
                                },
                                generalExtendedFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                },
                                wikiDefinitionHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.definition",
                                    "route": "/:version/dictionary/wiktionary/:language/definition/:word",
                                    "method": "get"
                                },
                                wikiDefinitionLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.listLanguages",
                                    "route": "/:version/dictionary/wiktionary/langs/definition/",
                                    "method": "get"
                                },
                                wikiSynonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/synonyms/:word",
                                    "method": "get"
                                },
                                wikiSynonymsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/langs/synonyms",
                                    "method": "get"
                                },
                                wikiAntonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/antonyms/:word",
                                    "method": "get"
                                },
                                wikiAntonymsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/langs/antonyms",
                                    "method": "get"
                                },
                                wikiPronunciationsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                wikiPronunciationsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/langs/pronunciations",
                                    "method": "get"
                                },
                                wikiFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/frequency/:word",
                                    "method": "get"
                                },
                                wikiFrequencyLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/langs/frequency",
                                    "method": "get"
                                },
                                wikiExtendedFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided",
                                    "route":  "/:version/dictionary/wiktionary/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                },
                                wikiLanguagesHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.wiktionary.listLanguages",
                                    "route": "/:version/dictionary/wiktionary/languages",
                                    "method": "get"
                                },
                                oxfordDefinitionHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.definition",
                                    "route": "/:version/dictionary/oxford/:language/definition/:word",
                                    "method": "get"
                                },
                                oxfordDefinitionLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route": "/:version/dictionary/oxford/langs/definition",
                                    "method": "get"
                                },
                                oxfordSynonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.synonyms",
                                    "route":  "/:version/dictionary/oxford/:language/synonyms/:word",
                                    "method": "get"
                                },
                                oxfordSynonymsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route":  "/:version/dictionary/oxford/langs/synonyms",
                                    "method": "get"
                                },
                                oxfordAntonymsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.antonyms",
                                    "route":  "/:version/dictionary/oxford/:language/antonyms/:word",
                                    "method": "get"
                                },
                                oxfordAntonymsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route":  "/:version/dictionary/oxford/langs/antonyms",
                                    "method": "get"
                                },
                                oxfordPronunciationsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.pronunciations",
                                    "route": "/:version/dictionary/oxford/:language/pronunciations/:word",
                                    "method": "get"
                                },
                                oxfordPronunciationsLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route": "/:version/dictionary/oxford/langs/pronunciations",
                                    "method": "get"
                                },
                                oxfordFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/oxford/:language/frequency/:word",
                                    "method": "get"
                                },
                                oxfordFrequencyLangsHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route": "/:version/dictionary/oxford/langs/frequency",
                                    "method": "get"
                                },
                                oxfordExtendedFrequencyHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.frequency",
                                    "route": "/:version/dictionary/oxford/:language/frequency/:word/:lexicalCategory",
                                    "method": "get"
                                },
                                oxfordLanguagesHandler: {
                                    "type": "adaptiveContentService.handlers.dictionary.oxford.listLanguages",
                                    "route": "/:version/dictionary/oxford/languages",
                                    "method": "get"
                                }
                            }
                        }
                    }
                },
                events: {
                    onListen: null
                },
                listeners: {
                    onListen: "adaptiveContentService.handlerUtils.checkOxfordServiceKeys"
                }
            }
        }
    }
});

// endpoint handlers
require("./handlers.js");

adaptiveContentService.dictionary.serverConfig();
