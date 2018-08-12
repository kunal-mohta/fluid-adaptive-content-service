"use strict";

require("../../../../index.js");
require("../../../testUtils");

module.exports = {
    nock: {
        oxford: {
            antonyms: require("../nock/mockOxfordAntonyms"),
            definition: require("../nock/mockOxfordDefinitions"),
            extendedFrequency: require("../nock/mockOxfordExtendedFrequency"),
            frequency: require("../nock/mockOxfordFrequency"),
            listLanguages: require("../nock/mockOxfordListLanguages"),
            pronunciations: require("../nock/mockOxfordPronunciations"),
            synonyms: require("../nock/mockOxfordSynonyms")
        }
    }
};
