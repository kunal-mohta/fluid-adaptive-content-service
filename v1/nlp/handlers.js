"use strict";

var fluid = require("infusion"),
    ACS = fluid.registerNamespace("ACS"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

// include common handler(s)
require("../handlers");

/* Abstract grade for nlp service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentService.handlers.nlp.sentenceTagging", {
    gradeNames: ["adaptiveContentService.handlers.commonMiddleware", "kettle.request.http"],
    characterLimit: 500,
    invokers: {
        handleRequest: {
            func: "{that}.commonNlpDispatcher",
            args: ["{arguments}.0", "{that}.nlpHandlerImpl", "{that}"]
        },
        commonNlpDispatcher: "adaptiveContentService.handlers.nlp.sentenceTagging.commonNlpDispatcher",
        // from handlerUtils
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Natural Language Processing (NLP)"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Natural Language Processing (NLP)"]
        },
        // not implemented - should be implemented in child grades
        nlpHandlerImpl: "fluid.notImplemented",
        checkNlpError: "fluid.notImplemented",
        requiredData: "fluid.notImplemented",
        constructResponse: "fluid.notImplemented"
    }
});

// Common dispatcher for all nlp endpoints
adaptiveContentService.handlers.nlp.sentenceTagging.commonNlpDispatcher = function (request, handlerFunc, that) {
    var version = request.req.params.version;

    try {
        handlerFunc(request, version, that);
    }
    //Error with the API code
    catch (error) {
        var errMsg = "Internal Server Error: " + error;
        ACS.log(errMsg);

        var serviceName = ACS.capitalize(that.getServiceName(request.req.originalUrl));
        that.sendErrorResponse(request, version, serviceName, 500, errMsg);
    }
};

require("./handlers/compromiseHandlers");
