"use strict";

var fluid = require("infusion"),
    ACS = fluid.registerNamespace("ACS"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("./index");

/* Abstract grade for dictionary service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentService.handlers.dictionary", {
    gradeNames: ["adaptiveContentService.handlers.commonMiddleware", "kettle.request.http"],
    wordCharacterLimit: 128,
    invokers: {
        handleRequest: {
            func: "{that}.commonDictionaryDispatcher",
            args: ["{arguments}.0", "{that}.dictionaryHandlerImpl", "{that}"]
        },
        commonDictionaryDispatcher: "adaptiveContentService.handlers.dictionary.commonDictionaryDispatcher",
        checkUriError: "adaptiveContentService.handlers.dictionary.checkUriError",
        checkLanguageCodes: "adaptiveContentService.handlerUtils.checkLanguageCodes",
        // from handlerUtils
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Dictionary"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Dictionary"]
        },
        // not implemented - should be implemented in child grades
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented",
        checkDictionaryErrorImpl: "fluid.notImplemented"
    }
});

// Common dispatcher for all dictionary endpoints
adaptiveContentService.handlers.dictionary.commonDictionaryDispatcher = function (request, serviceSpecificImp, that) {
    var version = request.req.params.version,
        word = request.req.params.word,
        lang = request.req.params.language;

    try {
        serviceSpecificImp(request, version, word, lang, that);
    }
    // Error with the API code
    catch (error) {
        var errMsg = "Internal Server Error: " + error;
        ACS.log(errMsg);

        var serviceName = ACS.capitalize(that.getServiceName(request.req.originalUrl));
        that.sendErrorResponse(request, version, serviceName, 500, errMsg);
    }
};

/* Common function for all the dictionary endpoints
 * to check for long uri
 */
adaptiveContentService.handlers.dictionary.checkUriError = function (word, characterLimit) {
    if (word.length > characterLimit) {
        // word length exceeds character limit
        return {
            statusCode: 414,
            errorMessage: "Request URI too long : 'word' can have maximum " + characterLimit + " characters"
        };
    }
    else {
        // no error
        return false;
    }
};

require("./handlers/wiktionaryHandlers");
require("./handlers/oxfordHandlers");
