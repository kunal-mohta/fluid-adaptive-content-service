"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit"),
    Ajv = require("ajv"),//npm package for JSON scheme validation
    kettle = require("kettle");

require("./utils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");

fluid.registerNamespace("adaptiveContentService.tests.utils");

adaptiveContentService.tests.utils = {};

// function to compare status code
adaptiveContentService.tests.utils.assertStatusCode = function (message, expectedStatusCode, responseStatusCode) {
    jqunit.assertEquals(message, expectedStatusCode, responseStatusCode);
};

adaptiveContentService.tests.utils.unitTestsDictionaryConstructResponse = function (functionToTest, testData, expectedReturnVal, message) {
    var returnVal = functionToTest(testData);

    jqunit.assertDeepEq(message, expectedReturnVal, returnVal);
};

// function to properly log AJV (Schema check) errors
adaptiveContentService.tests.utils.logAjvErrors = function (errors) {
    fluid.each(errors, function (error) {
        // property required but not found
        if (error.keyword === "required") {
            ACS.log("'" + error.params.missingProperty + "' is a REQUIRED property of {response}" + error.dataPath + ", but was absent");
        }
        // property of unexpected type
        else if (error.keyword === "type") {
            ACS.log("'{response}" + error.dataPath + "' SHOULD be of the type " + error.params.type.toUpperCase());
        }
        // default
        else {
            ACS.log("AJV error : " + error.message);
        }

        ACS.log("Complete error log - " + JSON.stringify(error));
    });
};

// handler function for contract tests
adaptiveContentService.tests.utils.contractTestHandler = function (data, schema, allSchemas, successMessage, failureMessage) {
    var ajv = new Ajv({ allErrors: true, schemas: allSchemas });

    require("ajv-merge-patch")(ajv);

    var validate = ajv.compile(schema),
        valid = validate(data);

    // if the data from the service follows the expected schema
    if (valid) {
        jqunit.assert("\n\n" + successMessage + "\n");
    }
    // if the data from the service does not follow the expected schema
    else {
        var errors = validate.errors;
        adaptiveContentService.tests.utils.logAjvErrors(errors);
        jqunit.fail("\n\n" + failureMessage + "\n");
    }
};

// provide oxford authentication keys for testing purpose
adaptiveContentService.tests.utils.getOxfordRequestHeaders = function () {
    return {
        "app_id": kettle.resolvers.env("OXFORD_APP_ID"),
        "app_key": kettle.resolvers.env("OXFORD_APP_KEY")
    };
};

// provide yandex authentication key for testing purpose
adaptiveContentService.tests.utils.getYandexServiceKey = function () {
    return kettle.resolvers.env("YANDEX_API_KEY");
};

// provide google authentication key for testing purpose
adaptiveContentService.tests.utils.getGoogleServiceKey = function () {
    return kettle.resolvers.env("GOOGLE_API_KEY");
};

// function to check for oxford api keys before starting contract test
adaptiveContentService.tests.utils.checkOxfordKeys = function (keys, testTree, testName) {
    var areKeysPresent = true;

    if (!keys.app_id) {
        areKeysPresent = false;
        ACS.log("Oxford 'App ID' not found. Refer README for instructions to adding it.");
    }

    if (!keys.app_key) {
        areKeysPresent = false;
        ACS.log("Oxford 'App Key' not found. Refer README for instructions to adding it.");
    }

    if (areKeysPresent) {
        //api keys present
        //run contract tests

        testTree();
    }
    else {
        //api key(s) absent, terminate test

        ACS.log("Terminating " + testName);
    }
};

// function to check for yandex api key before starting contract test
adaptiveContentService.tests.utils.checkYandexKeys = function (key, testTree, testName) {
    if (!key) {
        //api key absent
        //terminate contract test

        ACS.log("Yandex 'Api Key' not found. Refer README for instructions to adding it.");
        ACS.log("Terminating " + testName);
    }
    else {
        //api keys present
        //run contract tests

        testTree();
    }
};

// function to check for google api key before starting contract test
adaptiveContentService.tests.utils.checkGoogleKeys = function (key, testTree, testName) {
    if (!key) {
        //api key absent
        //terminate contract test

        ACS.log("Google 'Api Key' not found. Refer README for instructions to adding it.");
        ACS.log("Terminating " + testName);
    }
    else {
        //api keys present
        //run contract tests

        testTree();
    }
};

// function providing the required mock data (over-riding the actual function) for wiktionary definition endpoint integration tests
adaptiveContentService.tests.utils.wikiDefinitionRequiredData = function (lang, word, mockDefinitionData) {
    var promise = fluid.promise(),
        jsonMockResponse;

    // wrong word response
    if (word === mockDefinitionData.word.wrong) {
        jsonMockResponse = mockDefinitionData.responses.wrongWord;
        promise.resolve(jsonMockResponse);
    }
    // wrong lang response
    else if (lang === mockDefinitionData.lang.wrong) {
        jsonMockResponse = mockDefinitionData.responses.wrongLang;
        promise.resolve(jsonMockResponse);
    }
    // error making request
    else if (word === mockDefinitionData.word.requestErrorTrigger) {
        jsonMockResponse = mockDefinitionData.responses.requestError;
        promise.resolve(jsonMockResponse);
    }
    // no Error response
    else {
        jsonMockResponse = mockDefinitionData.word.correct;
        promise.resolve(mockDefinitionData.responses.correctWord);
    }

    return promise;
};

// function providing the required mock data (over-riding the actual function) for google integration tests
adaptiveContentService.tests.utils.googleLangDetectionRequiredData = function (text, mockLangDetectionData) {
    var promise = fluid.promise(),
        jsonMockResponse;

    // cannot detect the language response
    if (text === mockLangDetectionData.text.numerical) {
        jsonMockResponse = mockLangDetectionData.responses.cannotDetect;
        promise.resolve({
            statusCode: 200,
            body: jsonMockResponse
        });
    }
    // wrong service key
    else if (text === mockLangDetectionData.text.authErrorTrigger) {
        jsonMockResponse = mockLangDetectionData.responses.keyInvalid;
        promise.resolve({
            statusCode: jsonMockResponse.body.error.code,
            body: jsonMockResponse.body
        });
    }
    // error making request
    else if (text === mockLangDetectionData.text.requestErrorTrigger) {
        jsonMockResponse = mockLangDetectionData.responses.requestError;
        promise.resolve(jsonMockResponse);
    }
    // no Error response
    else {
        jsonMockResponse = mockLangDetectionData.responses.noError;
        promise.resolve({
            statusCode: 200,
            body: jsonMockResponse
        });
    }

    return promise;
};

// handle response from the oxford service for contract tests
adaptiveContentService.tests.utils.oxfordContractTestsRequestHandler = function (error, response, body, serviceName, that) {
    if (error) {
        // error making request to external service

        ACS.log("Contract Test (" + serviceName + ") : Error occured while making request to the external service - " + error);
        jqunit.fail("Contract Test : Failed due to error making request to the external service (" + serviceName + ")");
    }
    else {
        var jsonBody;

        // check for the presence of response body
        if (body) {
            try {
                // if body is json-parseable
                jsonBody = JSON.parse(body);
            }
            catch (err) {
                // if body is not json-parseable
                jsonBody = body;
            }

            var data = {
                response: response,
                body: body,
                jsonBody: jsonBody
            };

            that.events.onDataReceive.fire(data);
        }
        else {
            ACS.log("Contract Test (" + serviceName + ") : Response from the external service SHOULD have 'body' property");
            jqunit.fail("Contract Test : Failed (" + serviceName + ")");
        }
    }
};

// handle response from the google service for contract tests
adaptiveContentService.tests.utils.googleContractTestRequestHandler = function (err, responseBody, serviceName, that) {
    if (err) {
        // error with request

        if (err.body === undefined) {
            // error making request

            ACS.log("Contract Test (" + serviceName + ") - Error occured while making request to the external service");
            jqunit.fail("Contract Test : Failed due to error making request to the external service (" + serviceName + ")");
        }
        else {
            // request successful, but other errors catched
            var jsonBody;

            try {
                // is error body json parseable
                jsonBody = JSON.parse(err.body);
                that.events.onDataReceive.fire(jsonBody);
            }
            catch (e) {
                ACS.log("Contract Test (" + serviceName + ") - Error occured while parsing the error response body; body should be JSON pareseable -  " + e);
                ACS.log("Contract Test (" + serviceName + ") - Error Response body - \n" + err.body);
                jqunit.fail("Contract Test : For language detection failed due to error parsing response body into JSON");
            }
        }
    }
    // No errors
    else {
        that.events.onDataReceive.fire(responseBody);
    }
};

// handle response from the yandex service for contract tests
adaptiveContentService.tests.utils.yandexContractTestRequestHandler = function (error, body, serviceName, that) {
    if (error) {
        // error with making request to the service
        ACS.log("Contract Test (" + serviceName + ") - Error occured while making request to the external service");
        jqunit.fail("Contract Test : Failed due to error making request to the external service (" + serviceName + ")");
    }
    else {
        var jsonBody;

        try {
            // is error body json parseable
            jsonBody = JSON.parse(body);
            that.events.onDataReceive.fire(jsonBody);
        }
        catch (err) {
            ACS.log("Contract Test (" + serviceName + ") - Error occured while parsing the response body; body should be JSON pareseable -  " + err);
            ACS.log("Contract Test (" + serviceName + ") - Response body - \n" + body);
            jqunit.fail("Contract Test : Failed due to error parsing response body into JSON (" + serviceName + ")");
        }
    }
};
