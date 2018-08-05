"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./integrationTests/general/detectAndTranslate.js",
    "./integrationTests/general/langDetection.js",
    "./integrationTests/general/listLanguages.js",
    "./integrationTests/general/textTranslate.js",
    "./integrationTests/google/detectAndTranslate.js",
    "./integrationTests/google/langDetection.js",
    "./integrationTests/google/listLanguages.js",
    "./integrationTests/yandex/detectAndTranslate.js",
    "./integrationTests/yandex/langDetection.js",
    "./integrationTests/yandex/listLanguages.js",
    "./integrationTests/yandex/textTranslation.js",
    "./unitTests/common/checkServiceKey.js",
    "./unitTests/common/checkSourceText.js",
    "./unitTests/google/checkCommonGoogleErrors.js",
    "./unitTests/google/isLangUndefined.js",
    "./unitTests/google/langDetectionConstructResponse.js",
    "./unitTests/google/listLanguagesConstructResponse.js",
    "./unitTests/google/translationConstructResponse.js",
    "./unitTests/yandex/checkCommonYandexErrors.js",
    "./unitTests/yandex/isLangResponseEmpty.js",
    "./unitTests/yandex/langDetectionConstructResponse.js",
    "./unitTests/yandex/listLanguagesConstructResponse.js",
    "./unitTests/yandex/translationConstructResponse.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
