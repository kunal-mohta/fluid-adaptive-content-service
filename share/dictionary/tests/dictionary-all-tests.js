"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./integrationTests/general/antonymsTests.js",
    "./integrationTests/general/definitionTests.js",
    "./integrationTests/general/extendedFrequencyTests.js",
    "./integrationTests/general/frequencyTests.js",
    "./integrationTests/general/listLanguagesTests.js",
    "./integrationTests/general/pronunciationsTests.js",
    "./integrationTests/general/synonymsTests.js",
    "./integrationTests/oxford/antonymsOxfordTests.js",
    "./integrationTests/oxford/definitionOxfordTests.js",
    "./integrationTests/oxford/extendedFrequencyOxfordTests.js",
    "./integrationTests/oxford/frequencyOxfordTests.js",
    "./integrationTests/oxford/listLanguagesOxfordTests.js",
    "./integrationTests/oxford/pronunciationsOxfordTests.js",
    "./integrationTests/oxford/synonymsOxfordTests.js",
    "./integrationTests/wiktionary/antonymsWiktionaryTests.js",
    "./integrationTests/wiktionary/definitionWiktionaryTests.js",
    "./integrationTests/wiktionary/extendedFrequencyWiktionaryTests.js",
    "./integrationTests/wiktionary/frequencyWiktionaryTests.js",
    "./integrationTests/wiktionary/listLanguagesWiktionaryTests.js",
    "./integrationTests/wiktionary/pronunciationsWiktionaryTests.js",
    "./integrationTests/wiktionary/synonymsWiktionaryTests.js",
    "./unitTests/common/checkUriError.js",
    "./unitTests/oxford/antonymsConstructResponse.js",
    "./unitTests/oxford/checkDictionaryError.js",
    "./unitTests/oxford/checkServiceKeys.js",
    "./unitTests/oxford/definitionConstructResponse.js",
    "./unitTests/oxford/errorMsgScrape.js",
    "./unitTests/oxford/frequencyConstructResponse.js",
    "./unitTests/oxford/listLanguagesConstructResponse.js",
    "./unitTests/oxford/pronunciationsConstructResponse.js",
    "./unitTests/oxford/synonymsConstructResponse.js",
    "./unitTests/wiktionary/checkDictionaryError.js",
    "./unitTests/wiktionary/constructResponse.js",
    "./unitTests/wiktionary/getEndpointName.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
