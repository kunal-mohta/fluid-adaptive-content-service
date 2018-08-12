"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

fluid.defaults("adaptiveContentService.translation.serverConfig", {
    gradeNames: "fluid.component",
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8083,
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
                    onListen: "adaptiveContentService.handlerUtils.checkTranslationServiceKeys"
                }
            }
        }
    }
});

require("./handlers.js");
require("./middlewares");

adaptiveContentService.translation.serverConfig();
