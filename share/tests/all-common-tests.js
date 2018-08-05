"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "./handlerUtils/checkLanguageCodes.js",
    "./handlerUtils/getEndpointName.js",
    "./handlerUtils/getServiceName.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
