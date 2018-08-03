"use strict";

var fluid = require("infusion"),
    nlp = require("compromise");//npm package that provides NLP services

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");

require("kettle");

// Compromise sentence tagging grade
fluid.defaults("adaptiveContentService.handlers.nlp.compromise.sentenceTagging", {
    gradeNames: "adaptiveContentService.handlers.nlp.sentenceTagging",
    invokers: {
        nlpHandlerImpl: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging.getTags",
        checkNlpError: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging.checkNlpError",
        requiredData: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging.requiredData",
        constructResponse: "adaptiveContentService.handlers.nlp.compromise.sentenceTagging.constructResponse"
    }
});

// function to catch the errors for the compromise's sentence tagging
adaptiveContentService.handlers.nlp.compromise.sentenceTagging.checkNlpError = function (sentence, characterLimit) {
    //TODO: middleware
    if (sentence) {
        // sentence present

        if (sentence.length > characterLimit) {
            // sentence exceeds character limit
            return {
                statusCode: 413,
                errorMessage: "Sentence in request body should have character count less than or equal to " + characterLimit
            };
        }
        else {
            // no error
            return;
        }
    }
    else {
        // sentence not present
        return {
            statusCode: 400,
            errorMessage: "Request body doesn't contain 'sentence' field"
        };
    }
};

// get the required data from the compromise service
adaptiveContentService.handlers.nlp.compromise.sentenceTagging.requiredData = function (sentence) {
    var sentenceData = nlp(sentence),
        tagsData = sentenceData.out("tags");

    return tagsData;
};

// construct an appropriate response from the data from external service
adaptiveContentService.handlers.nlp.compromise.sentenceTagging.constructResponse = function (sentence, serviceTags) {
    var response = {
        sentence: sentence,
        termsArray: [],
        tagsArray: []
    };

    fluid.each(serviceTags, function (item) {
        response.termsArray.push(item.text);
        response.tagsArray.push(item.tags);
    });

    return response;
};

// Compromise sentence tagging handler
adaptiveContentService.handlers.nlp.compromise.sentenceTagging.getTags = function (request, version, that) {
    var sentence = request.req.body.sentence;

    var errorContent = that.checkNlpError(sentence, that.options.characterLimit);

    if (errorContent) {
        that.sendErrorResponse(request, version, "Compromise", errorContent.statusCode, errorContent.errorMessage);
    }
    else {
        var tags = that.requiredData(sentence),
            response = that.constructResponse(sentence, tags),
            message = "Sentence Tagged";

        that.sendSuccessResponse(request, version, "Compromise", 200, message, response);
    }
};
