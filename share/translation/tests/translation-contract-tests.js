"use strict";

require("../../utils");

var fluid = require("infusion"),
    kettle = require("kettle"),
    ACS = fluid.registerNamespace("ACS");

require("dotenv").config();

var testIncludes = [
    "./contractTests/google/detectAndTranslate.js",
    "./contractTests/google/langDetection.js",
    "./contractTests/google/listLanguages.js",
    "./contractTests/yandex/langDetection.js",
    "./contractTests/yandex/listLanguages.js",
    "./contractTests/yandex/textTranslation.js"
];

/* The following terminates tests if API keys are not present
 * for any of the translation services
 * to avoid unnecessary nodejs error when this file is run
 */

// Check for keys
var translationContractTestKeys = [
    "YANDEX_API_KEY",
    "GOOGLE_API_KEY"
];

var hasAnyValidKeys = function (expectedKeys) {
    var anyValidKeys = false;

    fluid.each(expectedKeys, function (key) {
        var resolvedKey = kettle.resolvers.env(key);
        if (resolvedKey) {
            anyValidKeys = true;
        }
    });

    return anyValidKeys;
};

if (hasAnyValidKeys(translationContractTestKeys)) {
    kettle.loadTestingSupport();

    fluid.each(testIncludes, function (path) {
        require(path);
    });
}
else {
    ACS.log("No API keys were found for any translation service, cannot run contract tests");
};
