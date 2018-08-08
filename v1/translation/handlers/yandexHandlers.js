"use strict";

var fluid = require("infusion"),
    makeRequest = require("request");//npm package used to make requests to third-party services used

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");

require("dotenv").config();//npm package to get variables from '.env' file
require("kettle");

// Specific grade for Yandex
fluid.defaults("adaptiveContentService.handlers.translation.yandex", {
    gradeNames: "adaptiveContentService.handlers.translation",
    authenticationOptions: {
        "api_key": "@expand:kettle.resolvers.env(YANDEX_API_KEY)"
    },
    urlBase: "https://translate.yandex.net/api/v1.5/tr.json/",
    invokers: {
        checkCommonYandexErrors: "adaptiveContentService.handlers.translation.yandex.checkCommonYandexErrors",
        requiredData: "adaptiveContentService.handlers.translation.yandex.requiredData",
        translationHandlerImpl: "fluid.notImplemented",
        constructResponse: "fluid.notImplemented"
    }
});

// function to catch the error content from the yandex service resopnse
adaptiveContentService.handlers.translation.yandex.checkCommonYandexErrors = function (serviceResponse) {

    // No error
    if (serviceResponse.statusCode === 200) {
        return false;
    }
    // invalid api key
    else if (serviceResponse.statusCode === 401) {
        return {
            statusCode: 403,
            errorMessage: "Authenticaion failed - " + serviceResponse.body.message
        };
    }
    // daily limit exceeded
    else if (serviceResponse.statusCode === 404) {
        return {
            statusCode: 429,
            errorMessage: serviceResponse.body.message
        };
    }
    // unsupported translation direction
    else if (serviceResponse.statusCode === 501) {
        return {
            statusCode: 404,
            errorMessage: serviceResponse.body.message + " - Please check the language codes"
        };
    }
    // remaining errors
    else {
        return {
            statusCode: serviceResponse.body.code,
            errorMessage: serviceResponse.body.message
        };
    }
};

// function to catch errors from the yandex service response,
adaptiveContentService.handlers.translation.yandex.checkLangDetectionError = function (serviceResponse, that) {
    var emptyLangErrorContent = that.isLangResponseEmpty(serviceResponse);

    // langDetection-specific errors
    if (serviceResponse.statusCode === 200 && emptyLangErrorContent) {
        return emptyLangErrorContent;
    }
    // general translation errors
    else {
        var errorContent = that.checkCommonYandexErrors(serviceResponse);

        return errorContent;
    }
};

// check if language field is empty in the response body
adaptiveContentService.handlers.translation.yandex.isLangResponseEmpty = function (serviceResponse) {
    if (!(serviceResponse.body.lang)) {
        // lang key absent
        return {
            statusCode: 404,
            errorMessage: "Language could not be detected from the text provided"
        };
    }
    else {
        return false;
    }
};

// function to get the required data from yandex
adaptiveContentService.handlers.translation.yandex.requiredData = function (url, text) {
    var promise = fluid.promise();

    makeRequest.post(
        {
            url: url,
            form: {
                text: text
            }
        },
        function (error, response, body) {
            try {
                if (error) {
                    // error making request
                    ACS.log("Error making request to the Yandex Service - " + error);
                    promise.resolve({
                        statusCode: 500,
                        body: {
                            message: "Internal Server Error : Error with making request to the external service (Yandex) - " + error
                        }
                    });
                }
                else {
                    // no error
                    var responseBody = JSON.parse(body);

                    var statusCode = ( responseBody.code ) ? responseBody.code : 200;

                    promise.resolve({
                        statusCode: statusCode,
                        body: responseBody
                    });
                }
            }
            // Error with the API code
            catch (error) {
                var errMsg = "Internal Server Error - " + error;
                ACS.log(errMsg);

                promise.resolve({
                    statusCode: 500,
                    body: {
                        message: errMsg
                    }
                });
            }
        }
    );

    return promise;
};

// function to construct a response from the data provided by the Yandex service
adaptiveContentService.handlers.translation.yandex.translationConstructResponse = function (serviceResponse, sourceText) {
    var translationDirection = serviceResponse.body.lang,
        regex = /^(\w+)-(\w+)$/,
        regexExec = regex.exec(translationDirection),
        sourceLang = regexExec[1],
        targetLang = regexExec[2];

    return {
        sourceLang: sourceLang,
        targetLang: targetLang,
        sourceText: sourceText,
        translatedText: serviceResponse.body.text
    };
};

// function performing common hendler tasks
adaptiveContentService.handlers.translation.yandex.commonHandlerTasks = function (request, version, characterLimit, serviceKey, url, langsObj, text, successMsg, that) {
    // check for errors before making request to the service
    var preRequestErrorContent = that.preRequestErrorCheck(characterLimit, serviceKey, langsObj, text, that);

    if (preRequestErrorContent) {
        that.sendErrorResponse(request, version, "Yandex", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
    }
    // No pre request errors
    else {

        // making request to the service
        that.requiredData(url, text)
            .then(
                function (result) {
                    try {
                        var serviceResponse = result,
                            errorContent = that.postRequestErrorCheck(serviceResponse);

                        // Check for error responses
                        if (errorContent) {
                            that.sendErrorResponse(request, version, "Yandex", errorContent.statusCode, errorContent.errorMessage);
                        }
                        // No error response
                        else {
                            var message = successMsg,
                                response = that.constructResponse(serviceResponse, text);

                            that.sendSuccessResponse(request, version, "Yandex", serviceResponse.statusCode, message, response);
                        }
                    }
                    // Error with the API code
                    catch (error) {
                        var errMsg = "Internal Server Error: " + error;
                        ACS.log(errMsg);

                        that.sendErrorResponse(request, version, "Yandex", 500, errMsg);
                    }
                }
            );
    }
};

// Yandex translation grade
fluid.defaults("adaptiveContentService.handlers.translation.yandex.translateText", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex",
    invokers: {
        postRequestErrorCheck: "{that}.checkCommonYandexErrors",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.yandex.translateText.getTranslation",
        constructResponse: "adaptiveContentService.handlers.translation.yandex.translationConstructResponse",
        commonHandlerTasks: "adaptiveContentService.handlers.translation.yandex.commonHandlerTasks"
    }
});

// Yandex translate text handler
adaptiveContentService.handlers.translation.yandex.translateText.getTranslation = function (request, version, that) {
    var sourceLang = request.req.params.sourceLang,
        targetLang = request.req.params.targetLang,
        text = request.req.body.text,
        characterLimit = that.options.characterLimit,
        serviceKey = that.options.authenticationOptions.api_key,
        url = that.options.urlBase + "translate?key=" + serviceKey + "&lang=" + sourceLang + "-" + targetLang,
        successMsg = "Translation successful",
        langsObj = {
            source: {
                name: "sourceLang",
                value: sourceLang
            },
            target: {
                name: "targetLang",
                value: targetLang
            }
        };

    that.commonHandlerTasks(request, version, characterLimit, serviceKey, url, langsObj, text, successMsg, that);
};

// Yandex language detection grade
fluid.defaults("adaptiveContentService.handlers.translation.yandex.langDetection", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex",
    invokers: {
        isLangResponseEmpty: "adaptiveContentService.handlers.translation.yandex.isLangResponseEmpty",
        postRequestErrorCheck: {
            funcName: "adaptiveContentService.handlers.translation.yandex.checkLangDetectionError",
            args: ["{arguments}.0", "{that}"]
        },
        translationHandlerImpl: "adaptiveContentService.handlers.translation.yandex.langDetection.getLang",
        constructResponse: "adaptiveContentService.handlers.translation.yandex.langDetection.constructResponse",
        commonHandlerTasks: "adaptiveContentService.handlers.translation.yandex.commonHandlerTasks"
    }
});

// function to construct a response from the data provided by the Yandex service
adaptiveContentService.handlers.translation.yandex.langDetection.constructResponse = function (serviceResponse, sourceText) {
    return {
        sourceText: sourceText,
        langCode: serviceResponse.body.lang
    };
};

// Yandex language detection handler
adaptiveContentService.handlers.translation.yandex.langDetection.getLang = function (request, version, that) {
    var text = request.req.body.text,
        characterLimit = that.options.characterLimit,
        serviceKey = that.options.authenticationOptions.api_key,
        url = that.options.urlBase + "detect?key=" + serviceKey,
        langsObj = false,
        successMsg = "Language Detection successful";

    that.commonHandlerTasks(request, version, characterLimit, serviceKey, url, langsObj, text, successMsg, that);
};

// Yandex translation (with only target language given) grade
fluid.defaults("adaptiveContentService.handlers.translation.yandex.detectAndTranslate", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex",
    invokers: {
        isLangResponseEmpty: "adaptiveContentService.handlers.translation.yandex.isLangResponseEmpty",
        checkLangDetectionError: "adaptiveContentService.handlers.translation.yandex.checkLangDetectionError",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.yandex.detectAndTranslate.getTranslation",
        constructResponse: "adaptiveContentService.handlers.translation.yandex.translationConstructResponse"
    }
});

//Yandlex translation (with target lang) handler
adaptiveContentService.handlers.translation.yandex.detectAndTranslate.getTranslation = function (request, version, that) {
    var targetLang = request.req.params.targetLang,
        text = request.req.body.text,
        characterLimit = that.options.characterLimit,
        serviceKey = that.options.authenticationOptions.api_key,
        langsObj = {
            target: {
                name: "targetLang",
                value: targetLang
            }
        };

    // check for errors before making request to the service
    var preRequestErrorContent = that.preRequestErrorCheck(characterLimit, serviceKey, langsObj, text, that);

    if (preRequestErrorContent) {
        that.sendErrorResponse(request, version, "Yandex", preRequestErrorContent.statusCode, preRequestErrorContent.errorMessage);
    }
    // No pre request errors
    else {

        var langDetectionUrl = that.options.urlBase + "detect?key=" + serviceKey;

        // making request to the service for lang detection
        that.requiredData(langDetectionUrl, text)
            .then(
                function (detectionResult) {
                    try {
                        var langDetectionErrorContent = that.checkLangDetectionError(detectionResult, that);

                        // Check for lang detection errors
                        if (langDetectionErrorContent) {
                            that.sendErrorResponse(request, version, "Yandex", langDetectionErrorContent.statusCode, langDetectionErrorContent.errorMessage);
                        }
                        // No lang detection error
                        else {
                            var sourceLang = detectionResult.body.lang,
                                translationUrl = that.options.urlBase + "translate?key=" + serviceKey + "&lang=" + sourceLang + "-" + targetLang;

                            // making request to the service for translation
                            that.requiredData(translationUrl, text)
                                .then(
                                    function (translationResult) {
                                        var translationErrorContent = that.checkCommonYandexErrors(translationResult);

                                        // Check for translation errors
                                        if (translationErrorContent) {
                                            that.sendErrorResponse(request, version, "Yandex", translationErrorContent.statusCode, translationErrorContent.errorMessage);
                                        }
                                        // No translation error
                                        else {
                                            var message = "Translation Successful",
                                                response = that.constructResponse(translationResult, sourceLang, targetLang, text);

                                            that.sendSuccessResponse(request, version, "Yandex", translationResult.statusCode, message, response);
                                        }
                                    }
                                );
                        }
                    }
                    // Error with the API code
                    catch (error) {
                        var errMsg = "Internal Server Error: " + error;
                        ACS.log(errMsg);

                        that.sendErrorResponse(request, version, "Yandex", 500, errMsg);
                    }
                }
            );
    }
};

// Yandex language detection grade
fluid.defaults("adaptiveContentService.handlers.translation.yandex.listLanguages", {
    gradeNames: "adaptiveContentService.handlers.translation.yandex",
    invokers: {
        postRequestErrorCheck: "{that}.checkCommonYandexErrors",
        constructResponse: "adaptiveContentService.handlers.translation.yandex.listLanguages.constructResponse",
        translationHandlerImpl: "adaptiveContentService.handlers.translation.yandex.listLanguages.getLangList"
    }
});

// function to construct a response from the data provided by the Yandex service
adaptiveContentService.handlers.translation.yandex.listLanguages.constructResponse = function (serviceResponse) {
    var languagesObj = serviceResponse.body.langs,
        response = [];

    fluid.each(languagesObj, function (langName, langCode) {
        response.push({
            code: langCode,
            name: langName
        });
    });

    return response;
};

// Yandex get all supported languages handler
adaptiveContentService.handlers.translation.yandex.listLanguages.getLangList = function (request, version, that) {
    var serviceKey = that.options.authenticationOptions.api_key;

    // check for errors before making request to the service
    var serviceKeyErrorContent = that.checkServiceKey(serviceKey);

    // error with the service key
    if (serviceKeyErrorContent) {
        that.sendErrorResponse(request, version, "Yandex", serviceKeyErrorContent.statusCode, serviceKeyErrorContent.errorMessage);
    }
    else {
        var url = that.options.urlBase + "getLangs?key=" + serviceKey + "&ui=en";

        that.requiredData(url, null)
            .then(
                function (result) {
                    try {
                        var serviceResponse = result,
                            errorContent = that.postRequestErrorCheck(serviceResponse);

                        // Check for error responses
                        if (errorContent) {
                            that.sendErrorResponse(request, version, "Yandex", errorContent.statusCode, errorContent.errorMessage);
                        }
                        // No error response
                        else {
                            var message = "Available languages fetched successfully",
                                response = that.constructResponse(serviceResponse);

                            that.sendSuccessResponse(request, version, "Yandex", serviceResponse.statusCode, message, response);
                        }
                    }
                    // Error with the API code
                    catch (error) {
                        var errMsg = "Internal Server Error: " + error;
                        ACS.log(errMsg);

                        that.sendErrorResponse(request, version, "Yandex", 500, errMsg);
                    }
                }
            );
    }
};
