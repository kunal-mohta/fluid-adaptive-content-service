"use strict";

var fluid = require("infusion");
var adaptiveContentServices = fluid.registerNamespace("adaptiveContentServices");
var wd = require("word-definition");
var makeRequest = require("request");//npm package used to make requests to third-party services used
var cheerio = require("cheerio");//npm package used for scrapping html responses

require("dotenv").config();//npm package to get variables from '.env' file

require("kettle");

/* Abstract grade for dictionary service endpoints
 * from which other service grades will inherit
 */
fluid.defaults("adaptiveContentServices.handlers.dictionary", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            func: "{that}.commonDictionaryDispatcher",
            args: ["{arguments}.0", "{that}.dictionaryHandlerImpl", "{that}"]
        },
        commonDictionaryDispatcher: "adaptiveContentServices.handlers.dictionary.commonDictionaryDispatcher",
        uriErrHandler: "adaptiveContentServices.handlers.dictionary.uriErrHandler",
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented",
        checkDictionaryErrorImpl: "fluid.notImplemented"
    }
});

//Common dispatcher for all dictionary endpoints
adaptiveContentServices.handlers.dictionary.commonDictionaryDispatcher = function (request, serviceSpecificImp, that) {
    var version = request.req.params.version;
    var word = request.req.params.word;
    var lang = request.req.params.language;

    serviceSpecificImp(request, version, word, lang, that);
};

/* Common function for all the dictionary endpoints
 * to check for long uri
 */
adaptiveContentServices.handlers.dictionary.uriErrHandler = function (request, word, serviceName) {
    if (word.length > 128) {
        request.events.onError.fire({
            version: "v1",
            service: {
                name: "Dictionary",
                source: serviceName
            },
            statusCode: 414,
            message: "Request URI too long: \"word\" can have maximum 128 characters",
            jsonResponse: {}
        });
    }
    else {
        return false;
    }
};

//Specific grade for Wiktionary
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary", {
    gradeNames: "adaptiveContentServices.handlers.dictionary",
    invokers: {
        checkDictionaryErrorImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError",
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented",
    }
});

//function  to catch the errors for wiktionary service (common to all endpoints provided by wiktionary grade)
adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError = function (serviceResponse) {

  //Check if there is an error
  if (serviceResponse.err) {

      //Word not found
      if (serviceResponse.err === "not found") {
          return {
              statusCode: 404,
              errorMessage: "Word not found"
          };
      }

      //Language unsupported by the third-party service
      else if (serviceResponse.err === "unsupported language") {
          return {
              statusCode: 404,
              errorMessage: "Unsupported Language: Only English (en), French (fr) and German (de) are supported right now"
          };
      }

      //Default return object when error hasn"t been handled yet
      else {
          return {
              statusCode: 500,
              errorMessage: "The error hasn\"t been handled yet"
          };
      }
  }

  //Return false if no error found
  else {
      return;
  }
};

//Wiktionary definition grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.definition", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.wiktionary",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.definition.getDefinition",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.definition.requiredData"
    }
});

//Wiktionary definition handler
adaptiveContentServices.handlers.dictionary.wiktionary.definition.getDefinition = function (request, version, word, lang, that) {
    try {
        //Check for long URI
        if (!that.uriErrHandler(request, word, "Wiktionary")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse);

                    request.res.set({
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                    });

                    //Error Responses
                    if (errorContent) {
                        request.events.onError.fire({
                            version: "v1",
                            service: {
                                name: "Dictionary",
                                source: "Wiktionary"
                            },
                            statusCode: errorContent.statusCode,
                            message: errorContent.errorMessage,
                            jsonResponse: {}
                        });
                    }
                    //No error : Word found
                    else {
                        request.events.onSuccess.fire({
                            version: "v1",
                            service: {
                                name: "Dictionary",
                                source: "Wiktionary"
                            },
                            statusCode: 200,
                            message: "Word Found",
                            jsonResponse: {
                                word: serviceResponse.word,
                                entries: [
                                    {
                                        category: serviceResponse.category,
                                        definitions: [serviceResponse.definition]
                                    }
                                ]
                            }
                        });
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        request.events.onError.fire({
            version: "v1",
            statusCode: 500,
            message: "Internal Server Error: " + error,
            service: {
                name: "Dictionary",
                source: "Wiktionary"
            },
            jsonResponse: {}
        });
    }
};

//function to get definition from the wiktionary service
adaptiveContentServices.handlers.dictionary.wiktionary.definition.requiredData = function (lang, word) {
    var promise = fluid.promise();
    wd.getDef(word, lang, null, function (data) {
        promise.resolve(data);
    });
    return promise;
};

//Specific grade for Oxford
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford", {
    gradeNames: "adaptiveContentServices.handlers.dictionary",
    invokers: {
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented",
        checkDictionaryErrorImpl: "adaptiveContentServices.handlers.dictionary.oxford.checkDictionaryError",
        errorMsgScrape: "adaptiveContentServices.handlers.dictionary.oxford.errorMsgScrape"
    }
});

//function  to catch the errors for oxford service
adaptiveContentServices.handlers.dictionary.oxford.checkDictionaryError = function (serviceResponse, that) {
  var OXFORD_ERROR_CODES = [400, 403, 404, 414, 500, 502, 503, 504];

  //Check if there is an error
  if (serviceResponse.statusCode !== 200) {

      //Handles all the errors together
      if (OXFORD_ERROR_CODES.indexOf(serviceResponse.statusCode) >= 0) {
          return {
              statusCode: serviceResponse.statusCode,
              errorMessage: that.errorMsgScrape(serviceResponse.body)
          };
      }

      //Default return object when error hasn"t been handled yet
      else {
          return {
              statusCode: 501,
              errorMessage: "The error hasn\"t been handled yet"
          };
      }
  }
};

//function to scrape the error message from the html response given by oxford
adaptiveContentServices.handlers.dictionary.oxford.errorMsgScrape = function (htmlResponse) {
  var $ = cheerio.load(htmlResponse);
  var message = $("h1").text() + ": " + $("p").text();

  if (message) {
      return message;
  }
  else {
      return htmlResponse;
  }
};

//Oxford definition grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford.definition", {
  gradeNames: "adaptiveContentServices.handlers.dictionary.oxford",
  invokers: {
      dictionaryHandlerImpl: {
          funcName: "adaptiveContentServices.handlers.dictionary.oxford.definition.getDefinition",
          args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
      },
      requiredDataImpl: "adaptiveContentServices.handlers.dictionary.oxford.definition.requiredData"
  }
});

//Oxford definition handler
adaptiveContentServices.handlers.dictionary.oxford.definition.getDefinition = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, word, "Oxford")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse, that);

                    request.res.set({
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                    });

                    //Error Responses
                    if (errorContent) {
                        request.events.onError.fire({
                            version: "v1",
                            service: {
                                name: "Dictionary",
                                source: "Oxford"
                            },
                            statusCode: errorContent.statusCode,
                            message: errorContent.errorMessage,
                            jsonResponse: {}
                        });
                    }
                    //No error : Word found
                    else {
                        var jsonServiceResponse = JSON.parse(serviceResponse.body);
                        var response = {
                            word: word,
                            entries: []
                        };

                        var i;
                        for (i = 0; i < jsonServiceResponse.results[0].lexicalEntries.length; i++) {
                            response.entries[i] = {
                                category: jsonServiceResponse.results[0].lexicalEntries[i].lexicalCategory,
                                definitions: jsonServiceResponse.results[0].lexicalEntries[i].entries[0].senses[0].definitions
                            };
                        }

                        request.events.onSuccess.fire({
                            version: "v1",
                            service: {
                                name: "Dictionary",
                                source: "Oxford"
                            },
                            statusCode: 200,
                            message: "Word Found",
                            jsonResponse: response
                        });
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        request.events.onError.fire({
            version: "v1",
            service: {
                name: "Dictionary",
                source: "Oxford"
            },
            statusCode: 500,
            message: "Internal Server Error: " + error,
            jsonResponse: {}
        });
    }
};

//function to get definition from the oxford service
adaptiveContentServices.handlers.dictionary.oxford.definition.requiredData = function (lang, word) {
    var promise = fluid.promise();

    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/entries/" + lang + "/" + word,
            headers: {
                "app_id": process.env.OXFORD_APP_ID,
                "app_key": process.env.OXFORD_APP_KEY
            }
        },
        function (error, response, body) {
            if (error) {
                promise.resolve({
                    statusCode: 501
                });
            }
            else {
                promise.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            }
        }
    );

    return promise;
};

//Oxford synonyms grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.oxford.synonyms", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.oxford",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.oxford.synonyms.getSynonyms",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.oxford.synonyms.requiredData",
        constructResponse: "adaptiveContentServices.handlers.dictionary.oxford.synonyms.constructResponse"
    }
});

//Oxford synonyms handler
adaptiveContentServices.handlers.dictionary.oxford.synonyms.getSynonyms = function (request, version, word, lang, that) {
    try {

        //Check for long URI
        if (!that.uriErrHandler(request, word, "Oxford")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse, that);

                    request.res.set({
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                    });

                    //Error Responses
                    if (errorContent) {
                        request.events.onError.fire({
                            version: "v1",
                            service: {
                                name: "Dictionary",
                                source: "Oxford"
                            },
                            statusCode: errorContent.statusCode,
                            message: errorContent.errorMessage,
                            jsonResponse: {}
                        });
                    }
                    //No error : Word found
                    else {
                        var jsonServiceResponse = JSON.parse(serviceResponse.body);
                        var response = that.constructResponse(word, jsonServiceResponse);
                        
                        request.events.onSuccess.fire({
                            version: "v1",
                            service: {
                                name: "Dictionary",
                                source: "Oxford"
                            },
                            statusCode: 200,
                            message: "Word Found",
                            jsonResponse: response
                        });
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        request.events.onError.fire({
            version: "v1",
            service: {
                name: "Dictionary",
                source: "Oxford"
            },
            statusCode: 500,
            message: "Internal Server Error: " + error,
            jsonResponse: {}
        });
    }
};

//function to get the synonyms from the oxford service
adaptiveContentServices.handlers.dictionary.oxford.synonyms.requiredData = function (lang, word) {
    var promise = fluid.promise();

    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/entries/" + lang + "/" + word + "/synonyms",
            headers: {
                "app_id": process.env.OXFORD_APP_ID,
                "app_key": process.env.OXFORD_APP_KEY
            }
        },
        function (error, response, body) {
            if (error) {
                promise.resolve({
                    statusCode: 501
                });
            }
            else {
                promise.resolve({
                    statusCode: response.statusCode,
                    body: body
                });
            }
        }
    );

    return promise;
};

//function to construct a useful response from the data provided by the Oxford Service
adaptiveContentServices.handlers.dictionary.oxford.synonyms.constructResponse = function (word, jsonServiceResponse) {
    var response = {
        word: word,
        entries: []
    };

    var i, j, k, l, m, n, p;
    var lexicalEntries = jsonServiceResponse.results[0].lexicalEntries;
    for (i = 0; i < lexicalEntries.length; i++) {
        var sensesIndex = 0;

        response.entries[i] = {};
        response.entries[i].category = lexicalEntries[i].lexicalCategory;
        response.entries[i].senses = [];

        var entries = lexicalEntries[i].entries;
        for (j = 0; j < entries.length; j++) {

            var senses = entries[j].senses;
            for (k = 0; k < senses.length; k++) {
                response.entries[i].senses[sensesIndex] = {
                    examples: [],
                    synonyms: []
                };

                if (senses[k].examples) {
                    for (l = 0; l < senses[k].examples.length; l++) {
                        response.entries[i].senses[sensesIndex].examples.push(senses[k].examples[l].text);
                    }
                }

                if (senses[k].synonyms) {
                    for (p = 0; p < senses[k].synonyms.length; p++) {
                        response.entries[i].senses[sensesIndex].synonyms.push(senses[k].synonyms[p].text);
                    }
                }

                if (senses[k].subsenses) {
                    for (m = 0; m < senses[k].subsenses.length; m++) {
                        if (senses[k].subsenses[m].synonyms) {
                            for (n = 0; n < senses[k].subsenses[m].synonyms.length; n++) {
                                response.entries[i].senses[sensesIndex].synonyms.push(senses[k].subsenses[m].synonyms[n].text);
                            }
                        }
                    }
                }

                sensesIndex++;
            }
        }
    }

    return response;
}
