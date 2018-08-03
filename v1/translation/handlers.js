"use strict";

var fluid = require("infusion"),
    ACS = fluid.registerNamespace("ACS"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("dotenv").config(); // npm package to get variables from '.env' file

require("../handlers");

/* Abstract grade for translation service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentService.handlers.translation", {
    gradeNames: ["adaptiveContentService.handlers.commonMiddleware", "kettle.request.http"],
    characterLimit: 500,
    invokers: {
        handleRequest: {
            func: "{that}.commonTranslationDispatcher",
            args: ["{arguments}.0", "{that}.translationHandlerImpl", "{that}"]
        },
        commonTranslationDispatcher: "adaptiveContentService.handlers.translation.commonTranslationDispatcher",
        checkSourceText: "adaptiveContentService.handlers.translation.checkSourceText",
        checkLanguageCodes: "adaptiveContentService.handlers.translation.checkLanguageCodes",
        checkServiceKey: "adaptiveContentService.handlers.translation.checkServiceKey",
        preRequestErrorCheck: "adaptiveContentService.handlers.translation.preRequestErrorCheck",
        // from handlerUtils
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Translation"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Translation"]
        },
        // not implemented - should be implemented in child grades
        requiredData: "fluid.notImplemented",
        translationHandlerImpl: "fluid.notImplemented"
    }
});

// Common dispatcher for all Yandex endpoints
adaptiveContentService.handlers.translation.commonTranslationDispatcher = function (request, handlerFunc, that) {
    var version = request.req.params.version;


    try {
        handlerFunc(request, version, that);
    }
    // Error with the API code
    catch (error) {
        var errMsg = "Internal Server Error: " + error;
        ACS.log(errMsg);

        var serviceName = ACS.capitalize(that.getServiceName(request.req.originalUrl));
        that.sendErrorResponse(request, version, serviceName, 500, errMsg);
    }
};

// check for errors in the text provided in the request body
adaptiveContentService.handlers.translation.checkSourceText = function (sourceText, characterLimit) {
    // no text found in request body
    if (!sourceText) {
        return {
            statusCode: 400,
            errorMessage: "Request body doesn't contain 'text' field"
        };
    }
    // too long text
    else if (sourceText.length > characterLimit) {
        return {
            statusCode: 413,
            errorMessage: "Text in the request body should have character count less than or equal to " + characterLimit
        };
    }
    // No error regarding the request text
    else {
        return false;
    }
};

// check for errors with the service keys present in environment variables
adaptiveContentService.handlers.translation.checkServiceKey = function (serviceKey) {
    // No keys present in the environment variables
    if (!serviceKey) {
        var message = "Authentication failed - API key not found. Please check your environment variables";

        return {
            statusCode: 403,
            errorMessage: message
        };
    }
    // keys present in the environment variables
    else {
        return false;
    }
};

// check for errors with the language codes
adaptiveContentService.handlers.translation.checkLanguageCodes = function (langsObj) {
    if (!langsObj) {
        // parameter absent or false
        return false;
    }
    else {
        var errorContent = false; // default return value is 'false'

        // if any of the languages have length more than 3
        for (var lang in langsObj) {
            if (langsObj[lang].value.length > 3) {
                errorContent = {
                    statusCode: 404,
                    errorMessage: "Invalid '" + langsObj[lang].name + "' parameter - Please check the language code"
                };
                break;
            }
        }

        return errorContent;
    }
};

// check for errors in the input data, before making the request to external service
adaptiveContentService.handlers.translation.preRequestErrorCheck = function (characterLimit, serviceKey, langsObj, text, that) {
    var sourceTextErrorContent = that.checkSourceText(text, characterLimit);

    if (sourceTextErrorContent) {
        // Error with the text in request body
        return sourceTextErrorContent;
    }
    else {
        // No error with the text in request body

        var serviceKeyErrorContent = that.checkServiceKey(serviceKey);

        if (serviceKeyErrorContent) {
            // Error with the service keys in the environment variables
            return serviceKeyErrorContent;
        }
        else {
            // No error with the service keys

            var langCodeErrorContent = that.checkLanguageCodes(langsObj);

            if (langCodeErrorContent) {
                // Error with the language codes provided
                return langCodeErrorContent;
            }
            else {
                // No pre request error found
                return false;
            }
        }
    }
};

require("./handlers/yandexHandlers");
require("./handlers/googleHandlers");
