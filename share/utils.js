"use strict";

var fluid = require("infusion");

var ACS = fluid.registerNamespace("ACS");

// utility function for logging
ACS.log = function (message) {
    // Cyan colored highlight for the log message label
    var label = "\x1b[36mAdaptive Content Service : \x1b[0m";

    fluid.log(fluid.logLevel.IMPORTANT, label + message);
};

// utility function to capitalize first letter of a string
ACS.capitalize = function (string) {
    return ( string[0].toUpperCase() + string.slice(1) );
};
