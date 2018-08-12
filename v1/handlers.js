"use strict";

var fluid = require("infusion");

require("./index");
require("kettle");

/* Abstract grade
 * from which all the service grades will extract
 * provides all the commonly required options
 */
fluid.defaults("adaptiveContentService.handlers.commonMiddleware", {
    requestMiddleware: {
        "versionCheck": {
            middleware: "{server}.versionCheck"
        },
        "setResponseHeaders": {
            middleware: "{server}.setResponseHeaders"
        }
    },
    invokers: {
        getServiceName: "adaptiveContentService.handlerUtils.getServiceName"
    }
});
