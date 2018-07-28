"use strict";

var fluid = require("infusion");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("dotenv").config();//npm package to get variables from '.env' file
require("kettle");
require("../../share/handlerUtils");

/* Abstract grade for translation service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentService.handlers.translation", {
    gradeNames: "kettle.request.http",
    characterLimit: "500",
    requestMiddleware: {
        "versionCheck": {
            middleware: "{server}.versionCheck"
        }
    },
    invokers: {
        handleRequest: {
            func: "{that}.commonTranslationDispatcher",
            args: ["{arguments}.0", "{that}.translationHandlerImpl", "{that}"]
        },
        commonTranslationDispatcher: "adaptiveContentService.handlers.translation.commonTranslationDispatcher",
        sendSuccessResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendSuccessResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "{arguments}.5", "Translation"]
        },
        sendErrorResponse: {
            funcName: "adaptiveContentService.handlerUtils.sendErrorResponse",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{arguments}.4", "Translation"]
        },
        checkSourceText: "adaptiveContentService.handlers.translation.checkSourceText",
        checkLanguageCodes: "adaptiveContentService.handlers.translation.checkLanguageCodes",
        checkServiceKey: "adaptiveContentService.handlers.translation.checkServiceKey",
        preRequestErrorCheck: "adaptiveContentService.handlers.translation.preRequestErrorCheck",
        requiredData: "fluid.notImplemented",
        // translationConstructResponse: "fluid.notImplemented",
        translationHandlerImpl: "fluid.notImplemented"
    }
});

// Common dispatcher for all Yandex endpoints
adaptiveContentService.handlers.translation.commonTranslationDispatcher = function (request, handlerFunc, that) {
    var version = request.req.params.version;

    console.log(request.req);

    //setting the required headers for the response
    request.res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });

    handlerFunc(request, version, that);
};

// check for errors in the text provided in the request body
adaptiveContentService.handlers.translation.checkSourceText = function (sourceText, characterLimit) {
    //no text found in request body
    if (!sourceText) {
        return {
            statusCode: 400,
            errorMessage: "Request body doesn't contain 'text' field"
        };
    }
    //too long text
    else if (sourceText.length > characterLimit) {
        return {
            statusCode: 413,
            errorMessage: "Text in the request body should have character count less than or equal to " + characterLimit
        };
    }
    //No error regarding the request text
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
        return false;
    }
    else {
        var errorContent = false; //default return value is 'false'

        //if any of the languages have length more than 3
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
    //Error with the text in request body
    var sourceTextErrorContent = that.checkSourceText(text, characterLimit);

    if (sourceTextErrorContent) {
        return sourceTextErrorContent;
    }
    //No error with the text in request body
    else {
        //Error with the service keys in the environment variables
        var serviceKeyErrorContent = that.checkServiceKey(serviceKey);

        if (serviceKeyErrorContent) {
            return serviceKeyErrorContent;
        }
        //No error with the service keys
        else {
            //Error with the language codes provided

            var langCodeErrorContent = that.checkLanguageCodes(langsObj);

            if (langCodeErrorContent) {
                return langCodeErrorContent;
            }
            //No pre request error found
            else {
                return false;
            }
        }
    }
};

require("./handlers/yandexHandlers");
require("./handlers/googleHandlers");
