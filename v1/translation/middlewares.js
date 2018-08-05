"use strict";

var fluid = require("infusion");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

fluid.defaults("adaptiveContentService.translation.middleware.versionCheck", {
    gradeNames: "kettle.middleware",
    invokers: {
        handle: "adaptiveContentService.translation.middleware.versionCheck.handler"
    }
});

adaptiveContentService.translation.middleware.versionCheck.handler = function (request) {
    var promise = fluid.promise();

    var version = request.req.params.version;

    if (version === "v1") {
        promise.resolve();
    }
    else {
        promise.reject({
            statusCode: 400,
            message: "Wrong version",
            jsonResponse: {}
        });
    }

    return promise;
}
