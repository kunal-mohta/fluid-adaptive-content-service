"use strict";

require("../../../../index.js");
require("../../../testUtils");

module.exports = {
    nock: {
        yandex: {
            listLanguages: require("../nock/yandex/mockListLanguages"),
            langDetection: require("../nock/yandex/mockYandexLangDetection"),
            translation: require("../nock/yandex/mockYandexTranslation")
        }
    }
};
