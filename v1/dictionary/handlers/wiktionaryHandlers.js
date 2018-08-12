"use strict";

var fluid = require("infusion"),
    ACS = fluid.registerNamespace("ACS"),
    adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    wd = require("word-definition");

require("../index");
require("kettle");

// Specific grade for Wiktionary
fluid.defaults("adaptiveContentService.handlers.dictionary.wiktionary", {
    gradeNames: "adaptiveContentService.handlers.dictionary",
    invokers: {
        checkDictionaryErrorImpl: "adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError",
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented"
    }
});

// function  to catch the errors for wiktionary service (common to all endpoints provided by wiktionary grade)
adaptiveContentService.handlers.dictionary.wiktionary.checkDictionaryError = function (serviceResponse) {

  // Check if there is an error
    if (serviceResponse.err) {

        // Word not found
        if (serviceResponse.err === "not found") {
            return {
                statusCode: 404,
                errorMessage: "Word not found"
            };
        }

        // Language unsupported by the third-party service
        else if (serviceResponse.err === "unsupported language") {
            return {
                statusCode: 404,
                errorMessage: "Unsupported Language: Only English (en), French (fr) and German (de) are supported right now"
            };
        }

        // request failed
        else if (serviceResponse.err === "a request has failed") {
            return {
                statusCode: 500,
                errorMessage: "Failed to make request to the external service (Wiktionary)"
            };
        }

        // Default return object when error hasn"t been handled yet
        else {
            return {
                statusCode: 501,
                errorMessage: "The error hasn't been handled yet"
            };
        }
    }

    // no error
    else {
        return;
    }
};

// Wiktionary definition grade
fluid.defaults("adaptiveContentService.handlers.dictionary.wiktionary.definition", {
    gradeNames: "adaptiveContentService.handlers.dictionary.wiktionary",
    invokers: {
        dictionaryHandlerImpl: "adaptiveContentService.handlers.dictionary.wiktionary.definition.getDefinition",
        preRequestErrorCheck: "adaptiveContentService.handlers.dictionary.wiktionary.definition.preRequestErrorCheck",
        requiredDataImpl: "adaptiveContentService.handlers.dictionary.wiktionary.definition.requiredData",
        constructResponse: "adaptiveContentService.handlers.dictionary.wiktionary.definition.constructResponse"
    }
});

// function to catch the errors before making the request to the wiktionary service
adaptiveContentService.handlers.dictionary.wiktionary.definition.preRequestErrorCheck = function (word, langsObj, that) {
    // Error with the word in uri
    var uriErrorContent = that.checkUriError(word, that.options.wordCharacterLimit);

    if (uriErrorContent) {
        // uri error present
        return uriErrorContent;
    }
    else {
        // No error with the word in uri

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
};

// function to get definition from the wiktionary service
adaptiveContentService.handlers.dictionary.wiktionary.definition.requiredData = function (lang, word) {
    var promise = fluid.promise();

    wd.getDef(word, lang, null, function (data) {
        promise.resolve(data);
    });

    return promise;
};

// function to construct a useful response from the data provided by the word-definition (Wiktionary) service
adaptiveContentService.handlers.dictionary.wiktionary.definition.constructResponse = function (jsonServiceResponse) {
    var response = {
        word: jsonServiceResponse.word,
        entries: [
            {
                category: jsonServiceResponse.category,
                definitions: [jsonServiceResponse.definition]
            }
        ]
    };

    return response;
};

// Wiktionary definition handler
adaptiveContentService.handlers.dictionary.wiktionary.definition.getDefinition = function (request, version, word, lang, that) {
    try {
        var langsObj = {
            dictionaryLang: {
                value: lang,
                name: "language"
            }
        };

        var preRequestErrorContent = that.preRequestErrorCheck(word, langsObj, that);

        // Check for errors before making the request
        if (preRequestErrorContent) {
            that.sendErrorResponse(request, version, "Wiktionary", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
        }
        else {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    try {
                        serviceResponse = result;

                        errorContent = that.checkDictionaryErrorImpl(serviceResponse);

                        var message;

                        // Error Responses
                        if (errorContent) {
                            message = errorContent.errorMessage;
                            var statusCode = errorContent.statusCode;

                            that.sendErrorResponse(request, version, "Wiktionary", statusCode, message);
                        }
                        // No error : Word found
                        else {
                            message = "Word Found";
                            var response = that.constructResponse(serviceResponse);

                            that.sendSuccessResponse(request, version, "Wiktionary", 200, "Word Found", response);
                        }
                    }
                    catch (error) {
                        var errMsg = "Internal Server Error: " + error;
                        ACS.log(errMsg);
                        that.sendErrorResponse(request, version, "Wiktionary", 500, errMsg);
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var errMsg = "Internal Server Error: " + error;
        ACS.log(errMsg);
        that.sendErrorResponse(request, version, "Wiktionary", 500, errMsg);
    }
};

// Wiktionary languages grade
fluid.defaults("adaptiveContentService.handlers.dictionary.wiktionary.listLanguages", {
    gradeNames: ["adaptiveContentService.handlers.dictionary.wiktionary"],
    invokers: {
        handleRequest: {
            funcName: "adaptiveContentService.handlers.dictionary.wiktionary.listLanguages.handlerImpl",
            args: ["{arguments}.0", "{that}"]
        },
        dictionaryHandlerImpl: "",
        requiredDataImpl: "adaptiveContentService.handlers.dictionary.wiktionary.listLanguages.requiredData"
    }
});

// function to get the required data
adaptiveContentService.handlers.dictionary.wiktionary.listLanguages.requiredData = function () {
    /* hard coded data is used here becauce 'word-definition'
     * doesn't provide any way to get the supported languages
     * and only 3 languages are supported
     */

    return {
        statusCode: 200,
        body: [
            {
                code: "en",
                name: "English"
            },
            {
                code: "fr",
                name: "French"
            },
            {
                code: "de",
                name: "German"
            }
        ]
    };
};

// Wiktionary languages handler
adaptiveContentService.handlers.dictionary.wiktionary.listLanguages.handlerImpl = function (request, that) {
    var version = request.req.params.version;

    try {
        var response = that.requiredDataImpl().body,
            statusCode = that.requiredDataImpl().statusCode;

        var message = "Available languages fetched successfully";

        that.sendSuccessResponse(request, version, "Wiktionary", statusCode, message, response);
    }
    //Error with the API code
    catch (error) {
        var errMsg = "Internal Server Error: " + error;
        ACS.log(errMsg);
        that.sendErrorResponse(request, version, "Wiktionary", 500, errMsg);
    }
};

// Wiktionary "Service not provided" grade
fluid.defaults("adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided", {
    gradeNames: ["adaptiveContentService.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.handlerImpl",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        getEndpointName: "adaptiveContentService.handlerUtils.getEndpointName",
        requiredDataImpl: "" // no data required because service not provided
    }
});

//Wiktionary service not provided handler function
adaptiveContentService.handlers.dictionary.wiktionary.serviceNotProvided.handlerImpl = function (request, version, that) {
    var endpointName = that.getEndpointName(request.req.originalUrl),
        message = "This Service doesn't provide " + endpointName;

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};
