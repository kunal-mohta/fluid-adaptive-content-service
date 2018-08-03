"use strict";

var fluid = require("infusion"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

// middleware for version check
fluid.defaults("adaptiveContentService.middleware.versionCheck", {
    gradeNames: "kettle.middleware",
    version: "v1",
    invokers: {
        handle: {
            funcName: "adaptiveContentService.middleware.versionCheck.handler",
            args: ["{arguments}.0", "{that}"]
        }
    }
});

adaptiveContentService.middleware.versionCheck.handler = function (request, that) {
    var promise = fluid.promise(),
        version = request.req.params.version;

    if (version === that.options.version) {
        promise.resolve();
    }
    else {
        promise.reject({
            statusCode: 400,
            message: "Unknown api version - '" + version + "'",
            jsonResponse: {}
        });
    }

    return promise;
};

// middleware to set response headers
fluid.defaults("adaptiveContentService.middleware.setResponseHeaders", {
    gradeNames: "kettle.middleware",
    invokers: {
        handle: "adaptiveContentService.middleware.setResponseHeaders.handler"
    }
});

adaptiveContentService.middleware.setResponseHeaders.handler = function (request) {
    var promise = fluid.promise();

    //setting the required headers for the response
    request.res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });
    promise.resolve();

    return promise;
};
