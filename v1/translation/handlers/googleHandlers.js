"use strict";

var fluid = require("infusion");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");

require("dotenv").config(); // npm package to get variables from '.env' file
require("kettle");

// Specific grade for Google
fluid.defaults("adaptiveContentService.handlers.translation.google", {
    gradeNames: "adaptiveContentService.handlers.translation",
    authenticationOptions: {
        "api_key": "@expand:kettle.resolvers.env(GOOGLE_API_KEY)"
    },
    invokers: {
        checkCommonGoogleErrors: "adaptiveContentService.handlers.translation.google.checkCommonGoogleErrors",
        handleReceivedData: "adaptiveContentService.handlers.translation.google.handleReceivedData",
        commonHandlerTasks: "adaptiveContentService.handlers.translation.google.commonHandlerTasks",
        constructResponse: "fluid.notImplemented",
        translationHandlerImpl: "fluid.notImplemented"
    }
});

// function to catch the error content from the google service resopnse
adaptiveContentService.handlers.translation.google.checkCommonGoogleErrors = function (serviceResponse) {

    // No error
    if (serviceResponse.statusCode === 200) {
        return false;
    }
    // invalid api key
    else if (serviceResponse.statusCode === 400 && serviceResponse.body.error.message === "API key not valid. Please pass a valid API key.") {
        return {
            statusCode: 403,
            errorMessage: "Authentication failed - " + serviceResponse.body.error.message
        };
    }
    // invalid target language
    else if (serviceResponse.statusCode === 400 && serviceResponse.body.error.message === "Invalid Value") {
        return {
            statusCode: 404,
            errorMessage: "Invalid 'targetLang' parameter - Please check the language code"
        };
    }
    // error making request
    else if (serviceResponse.statusCode === 500) {
        return {
            statusCode: 500,
            errorMessage: serviceResponse.body.message
        };
    }
    // remaining errors
    else {
        return {
            statusCode: serviceResponse.body.error.code,
            errorMessage: serviceResponse.body.error.message
        };
    }
};

/* function to handle recieved data from the service
 * ie, structure it and send it to the main handler function
 */
adaptiveContentService.handlers.translation.google.handleReceivedData = function (err, responseBody, endpointName, promise) {
    try {
        if (err) {
            // errors
            if (err.error && err.error.syscall === "getaddrinfo") {
                // error making request to the service
                ACS.log("Error making request to the Google Service (" + endpointName + " endpoint)");
                promise.resolve({
                    statusCode: 500,
                    body: {
                        message: "Internal Server Error : Error with making request to the external service (Google)"
                    }
                });
            }
            else {
                // other errors
                var errorBody = JSON.parse(err.body);

                promise.resolve({
                    statusCode: errorBody.error.code,
                    body: errorBody
                });
            }
        }
        else {
            // no error
            promise.resolve({
                statusCode: 200,
                body: responseBody
            });
        }
    }
    // Error with the API code
    catch (error) {
        var errMsg = "Internal Server Error " + error;
        ACS.log(errMsg);

        promise.resolve({
            statusCode: 500,
            body: {
                message: errMsg
            }
        });
    }
};

// function to do the common tasks of handler functions
adaptiveContentService.handlers.translation.google.commonHandlerTasks = function (request, version, targetLang, serviceName, successMsg, serviceResponse, that) {
    var errorContent = that.postRequestErrorCheck(serviceResponse);

    // Check for error responses
    if (errorContent) {
        that.sendErrorResponse(request, version, serviceName, errorContent.statusCode, errorContent.errorMessage);
    }
    // No error response
    else {
        var message = successMsg,
            response = that.constructResponse(serviceResponse, targetLang);

        that.sendSuccessResponse(request, version, serviceName, serviceResponse.statusCode, message, response);
    }
};

// Google detect and translate grade
fluid.defaults("adaptiveContentService.handlers.translation.google.detectAndTranslate", {
    gradeNames: "adaptiveContentService.handlers.translation.google",
    invokers: {
        requiredData: "adaptiveContentService.handlers.translation.google.detectAndTranslate.requiredData",
        postRequestErrorCheck: "{that}.checkCommonGoogleErrors",
        constructResponse: "adaptiveContentService.handlers.translation.google.detectAndTranslate.constructResponse",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.google.detectAndTranslate.getTranslation"
    }
});

// function to get the required data from the google service
adaptiveContentService.handlers.translation.google.detectAndTranslate.requiredData = function (targetLang, text, that) {
    var promise = fluid.promise();

    var googleApiKey = that.options.authenticationOptions.api_key,
        googleTranslate = require("google-translate")(googleApiKey);

    googleTranslate.translate(text, targetLang, function (err, translation) {
        that.handleReceivedData(err, translation, "Detect-Translate", promise);
    });

    return promise;
};

// function to construct a response from the data provided by the Google service
adaptiveContentService.handlers.translation.google.detectAndTranslate.constructResponse = function (serviceResponse, targetLang) {
    return {
        sourceLang: serviceResponse.body.detectedSourceLanguage,
        targetLang: targetLang,
        sourceText: serviceResponse.body.originalText,
        translatedText: serviceResponse.body.translatedText
    };
};

// Google translate text handler
adaptiveContentService.handlers.translation.google.detectAndTranslate.getTranslation = function (request, version, that) {
    var targetLang = request.req.params.targetLang,
        text = request.req.body.text,
        googleApiKey = that.options.authenticationOptions.api_key;

    var characterLimit = that.options.characterLimit;

    var langsObj = {
        target: {
            name: "targetLang",
            value: targetLang
        }
    };

    // check for errors before making request to the service
    var preRequestErrorContent = that.preRequestErrorCheck(characterLimit, googleApiKey, langsObj, text, that);

    if (preRequestErrorContent) {
        that.sendErrorResponse(request, version, "Google", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
    }
    else {
        that.requiredData(targetLang, text, that)
            .then(
                function (result) {
                    try {
                        var serviceName = "Google",
                            successMsg = "Translation Successful";

                        that.commonHandlerTasks(request, version, targetLang, serviceName, successMsg, result, that);
                    }
                    // Error with the API code
                    catch (error) {
                        var errMsg = "Internal Server Error: " + error;
                        ACS.log(errMsg);
                        that.sendErrorResponse(request, version, "Google", 500, errMsg);
                    }
                }
            );
    }
};

// Google language detection grade
fluid.defaults("adaptiveContentService.handlers.translation.google.langDetection", {
    gradeNames: "adaptiveContentService.handlers.translation.google",
    invokers: {
        requiredData: "adaptiveContentService.handlers.translation.google.langDetection.requiredData",
        postRequestErrorCheck: {
            funcName: "adaptiveContentService.handlers.translation.google.langDetection.checkLangDetectionError",
            args: ["{arguments}.0", "{that}"]
        },
        isLangUndefined: "adaptiveContentService.handlers.translation.google.langDetection.isLangUndefined",
        constructResponse: "adaptiveContentService.handlers.translation.google.langDetection.constructResponse",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.google.langDetection.getLang"
    }
});

// function to get the required data from the google service
adaptiveContentService.handlers.translation.google.langDetection.requiredData = function (text, that) {
    var promise = fluid.promise();

    var googleApiKey = that.options.authenticationOptions.api_key,
        googleTranslate = require("google-translate")(googleApiKey);

    googleTranslate.detectLanguage(text, function (err, detection) {
        that.handleReceivedData(err, detection, "Language Detection", promise);
    });

    return promise;
};

// check if the detected language is undefined, i.e. language could not be detected
adaptiveContentService.handlers.translation.google.langDetection.isLangUndefined = function (serviceResponse) {
    if (serviceResponse.body.language === "und") {
        return {
            statusCode: 404,
            errorMessage: "Language could not be detected from the text provided"
        };
    }
    else {
        return false;
    }
};

// function to catch the error content from the Google service resopnse
adaptiveContentService.handlers.translation.google.langDetection.checkLangDetectionError = function (serviceResponse, that) {
    var undefinedLangErrorContent = that.isLangUndefined(serviceResponse);

    // langDetection-specific errors
    if (serviceResponse.statusCode === 200 && undefinedLangErrorContent) {
        return undefinedLangErrorContent;
    }
    // general translation errors
    else {
        var errorContent = that.checkCommonGoogleErrors(serviceResponse);

        return errorContent;
    }
};

// function to construct a response from the data provided by the Google service
adaptiveContentService.handlers.translation.google.langDetection.constructResponse = function (serviceResponse) {
    return {
        sourceText: serviceResponse.body.originalText,
        langCode: serviceResponse.body.language
    };
};

// Google language detection handler
adaptiveContentService.handlers.translation.google.langDetection.getLang = function (request, version, that) {
    var text = request.req.body.text,
        characterLimit = that.options.characterLimit,
        langsObj = false,
        googleApiKey = that.options.authenticationOptions.api_key;

    // check for errors before making request to the service
    var preRequestErrorContent = that.preRequestErrorCheck(characterLimit, googleApiKey, langsObj, text, that);

    if (preRequestErrorContent) {
        that.sendErrorResponse(request, version, "Google", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
    }
    else {
        that.requiredData(text, that)
            .then(
                function (result) {
                    try {
                        var serviceName = "Google",
                            successMsg = "Language Detection Successful";

                        that.commonHandlerTasks(request, version, null, serviceName, successMsg, result, that);
                    }
                    // Error with the API code
                    catch (error) {
                        var errMsg = "Internal Server Error: " + error;
                        ACS.log(errMsg);
                        that.sendErrorResponse(request, version, "Google", 500, errMsg);
                    }
                }
            );
    }
};

// Google language detection grade
fluid.defaults("adaptiveContentService.handlers.translation.google.listLanguages", {
    gradeNames: "adaptiveContentService.handlers.translation.google",
    invokers: {
        requiredData: "adaptiveContentService.handlers.translation.google.listLanguages.requiredData",
        postRequestErrorCheck: "{that}.checkCommonGoogleErrors",
        constructResponse: "adaptiveContentService.handlers.translation.google.listLanguages.constructResponse",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.google.listLanguages.getLangList"
    }
});

// function to get the required data from the google service
adaptiveContentService.handlers.translation.google.listLanguages.requiredData = function (langParam, that) {
    var promise = fluid.promise(),
        listInLang;

    var googleApiKey = that.options.authenticationOptions.api_key,
        googleTranslate = require("google-translate")(googleApiKey);

    // if the lang parameter is present
    if (langParam) {
        listInLang = langParam;
    }
    // default lang
    else {
        listInLang = "en";
    }

    googleTranslate.getSupportedLanguages(listInLang, function (err, languageCodes) {
        that.handleReceivedData(err, languageCodes, "List supported languages", promise);
    });

    return promise;
};

// function to construct a response from the data provided by the Google service
adaptiveContentService.handlers.translation.google.listLanguages.constructResponse = function (serviceResponse) {
    var response = {
        languages: []
    };

    var languages = serviceResponse.body;

    fluid.each(languages, function (langObj) {
        response.languages.push({
            code: langObj.language,
            name: langObj.name
        });
    });

    return response;
};

// google get all supported languages handler
adaptiveContentService.handlers.translation.google.listLanguages.getLangList = function (request, version, that) {
    var langParam = request.req.params.lang,
        googleApiKey = that.options.authenticationOptions.api_key;

    // check for errors before making request to the service
    var serviceKeyErrorContent = that.checkServiceKey(googleApiKey);

    // error with the service key
    if (serviceKeyErrorContent) {
        that.sendErrorResponse(request, version, "Google", serviceKeyErrorContent.statusCode, serviceKeyErrorContent.errorMessage);
    }
    else {
        that.requiredData(langParam, that)
            .then(
                function (result) {
                    try {
                        var serviceName = "Google",
                            successMsg = "Available languages fetched successfully";

                        that.commonHandlerTasks(request, version, null, serviceName, successMsg, result, that);
                    }
                    // Error with API code
                    catch (error) {
                        var errMsg = "Internal Server Error: " + error;
                        ACS.log(errMsg);
                        that.sendErrorResponse(request, version, "Google", 500, errMsg);
                    }
                }
            );
    }
};
