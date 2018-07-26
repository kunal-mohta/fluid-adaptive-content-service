"use strict";

var fluid = require("infusion");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

require("../handlerUtils");

/* Abstract grade for nlp service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentService.handlers.nlp.sentenceTagging", {
    gradeNames: "kettle.request.http",
    characterLimit: 10000,
    invokers: {
        handleRequest: {
            func: "{that}.commonNlpDispatcher",
            args: ["{arguments}.0", "{that}.nlpHandlerImpl", "{that}"]
        },
        commonNlpDispatcher: "adaptiveContentService.handlers.nlp.sentenceTagging.commonNlpDispatcher",
        nlpHandlerImpl: "fluid.notImplemented",
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Natural Language Processing (NLP)"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Natural Language Processing (NLP)"]
        },
        checkNlpError: "fluid.notImplemented",
        requiredData: "fluid.notImplemented",
        constructResponse: "fluid.notImplemented"
    }
});

adaptiveContentService.handlers.nlp.sentenceTagging.commonNlpDispatcher = function (request, handlerFunc, that) {
    var version = request.req.params.version;

    //setting the required headers for the response
    request.res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });

    handlerFunc(request, version, that);
};

require("./handlers/compromiseHandlers");
