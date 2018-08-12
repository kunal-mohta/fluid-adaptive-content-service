"use strict";

module.exports = {
    mockData: {
        common: {
            translation: require("./mockData/common/translation")
        },
        google: {
            langDetection: require("./mockData/google/langDetection"),
            listLanguages: require("./mockData/google/listLanguages"),
            translation: require("./mockData/google/translation")
        },
        yandex: {
            langDetection: require("./mockData/yandex/langDetection"),
            listLanguages: require("./mockData/yandex/listLanguages"),
            translation: require("./mockData/yandex/translation")
        }
    }
};
