"use strict";

module.exports = {
    mockData: {
        oxford: {
            antonyms: require("./mockData/oxford/antonyms"),
            definition: require("./mockData/oxford/definitions"),
            extendedFrequency: require("./mockData/oxford/extendedFrequency"),
            frequency: require("./mockData/oxford/frequency"),
            listLanguages: require("./mockData/oxford/listLanguages"),
            pronunciations: require("./mockData/oxford/pronunciations"),
            synonyms: require("./mockData/oxford/synonyms")
        },
        wiktionary: {
            definition: require("./mockData/wiktionary/definitions")
        }
    }
};
