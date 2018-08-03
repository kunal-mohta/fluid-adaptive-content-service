"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

fluid.defaults("adaptiveContentService.serverConfig", {
    gradeNames: "fluid.component",
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8080,
                components: {
                    versionCheck: {
                        "type": "adaptiveContentService.middleware.versionCheck"
                    },
                    setResponseHeaders: {
                        "type": "adaptiveContentService.middleware.setResponseHeaders"
                    },
                    dictionaryApp: {
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
                    },
                    nlpApp: {
                        type: "kettle.app",
                        options: {
                            requestHandlers: {
                                compromiseSentenceTaggingHandler: {
                                    "type": "adaptiveContentService.handlers.nlp.compromise.sentenceTagging",
                                    "route": "/:version/nlp/compromise/tags/",
                                    "method": "post"
                                }
                            }
                        }
                    },
                    translationApp: {
                        type: "kettle.app",
                        options: {
                            requestHandlers: {
                                generalTranslateTextHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.translateText",
                                    "route": "/:version/translation/translate/:sourceLang-:targetLang",
                                    "method": "post"
                                },
                                generalTranslateTextLangsHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.listLanguages",
                                    "route": "/:version/translation/langs/translate",
                                    "method": "get"
                                },
                                generalDetectAndTranslateHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.detectAndTranslate",
                                    "route": "/:version/translation/translate/:targetLang",
                                    "method": "post"
                                },
                                generalLangDetectionHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.langDetection",
                                    "route": "/:version/translation/detect",
                                    "method": "post"
                                },
                                yandexTranslateTextHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.translateText",
                                    "route": "/:version/translation/yandex/translate/:sourceLang-:targetLang",
                                    "method": "post"
                                },
                                yandexTranslateTextLangsHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.listLanguages",
                                    "route": "/:version/translation/yandex/langs/translate",
                                    "method": "get"
                                },
                                yandexLangDetectionHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.langDetection",
                                    "route": "/:version/translation/yandex/detect",
                                    "method": "post"
                                },
                                yandexDetectAndTranslateHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.detectAndTranslate",
                                    "route": "/:version/translation/yandex/translate/:targetLang",
                                    "method": "post"
                                },
                                yandexListLanguagesHandler: {
                                    "type": "adaptiveContentService.handlers.translation.yandex.listLanguages",
                                    "route": "/:version/translation/yandex/languages",
                                    "method": "get"
                                },
                                googleDetectAndTranslateHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.detectAndTranslate",
                                    "route": "/:version/translation/google/translate/:targetLang",
                                    "method": "post"
                                },
                                googleDetectAndTranslateLangsHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.listLanguages",
                                    "route": "/:version/translation/google/langs/translate",
                                    "method": "get"
                                },
                                googleLangDetectionHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.langDetection",
                                    "route": "/:version/translation/google/detect",
                                    "method": "post"
                                },
                                googleListLanguagesHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.listLanguages",
                                    "route": "/:version/translation/google/languages",
                                    "method": "get"
                                },
                                googleExtendedLanguagesHandler: {
                                    "type": "adaptiveContentService.handlers.translation.google.listLanguages",
                                    "route": "/:version/translation/google/languages/:lang",
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
                    onListen: "adaptiveContentService.serverConfig.checkServiceKeys"
                }
            }
        }
    }
});

adaptiveContentService.serverConfig.checkServiceKeys = function () {
    adaptiveContentService.handlerUtils.checkOxfordServiceKeys();
    adaptiveContentService.handlerUtils.checkTranslationServiceKeys();
};

require("./dictionary/handlers");
require("./nlp/handlers");
require("./translation/handlers");

adaptiveContentService.serverConfig();
