# fluid-adaptive-content-service
Repo for GSOC Project Described at https://wiki.fluidproject.org/display/fluid/Google+Summer+of+Code+2018+with+the+Fluid+Project#GoogleSummerofCode2018withtheFluidProject-Buildaserviceforadaptivecontentandlearningsupports

## Table of Contents

- [Instructions to run the service locally](#instructions-to-run-the-service-locally)
- [Available Endpoints](#available-endpoints)
  - [Dictionary Service](#dictionary-service)
  - [NLP Service](#nlp-service)
  - [Translation Service](#translation-service)
- [Running Tests](#running-tests)
- [Documentation](#documentation)
- [Notes for use of third-party services](#notes-for-use-of-third-party-services)

## Instructions to run the service locally
### Step 1 - Clone the Repository
### Step 2 - Install the required node modules
Run
```
npm install
```
### Step 3 - Setting API keys for services that require it
Third-party services that require API key -
- [Oxford](https://developer.oxforddictionaries.com/)
- [Yandex](https://tech.yandex.com/translate/)
- [Google](https://cloud.google.com/translate/docs/)


You can visit their respective websites and acquire their API keys to use the service.\
After acquiring the API keys, you will have to add them to the environment variables by creating a `.env` file.\
You can refer to the [.env.example](/.env.example) file in this repository to know how your `.env` file should look like.
### Step 4 - Start the service server
- **All Services together**
```
npm start
```
This will run all the endpoints, from all the services, at port 8080
- **Dictionary Service Server**
```
npm run dictionary
```
This will run all the dictionary service server, at port 8081
- **NLP Service Server**
```
npm run nlp
```
This will run all the nlp service server, at port 8082
- **Translation Service Server**
```
npm run translation
```
This will run all the translation service server, at port 8083

**Note** that all the above commands should be run at the root of the repository

When the server starts, it is ready to accept requests at the available endpoints.

## Available Endpoints
Currently available endpoints -
### Dictionary Service

- #### General Endpoints

  - `http://localhost:8081/v1/dictionary/{language_code}/definition/{word}`\
  **Method**: `GET`\
  **Language Code**: English (en), French (fr) and German (de)

  - `http://localhost:8081/v1/dictionary/{language_code}/synonyms/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/{language_code}/antonyms/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/{language_code}/pronunciations/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/{language_code}/frequency/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/{language_code}/frequency/{word}/{lexicalCategory}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/langs/{endpoint_name}`\
  **Method**: `GET`

  Example endpoints:
    - `http://localhost:8081/v1/dictionary/fr/definition/rien`
    - `http://localhost:8081/v1/dictionary/langs/definition`

- #### Wiktionary Endpoints

  - `http://localhost:8081/v1/dictionary/wiktionary/{language_code}/definition/{word}`\
  **Method**: `GET`\
  **Language Code**: English (en), French (fr) and German (de)

  - `http://localhost:8081/v1/dictionary/wiktionary/languages`\
  **Method**: `GET`

  - `http://localhost:8081/v1/dictionary/wiktionary/langs/{endpoint_name}`\
  **Method**: `GET`

  Example endpoints:
    - `http://localhost:8081/v1/dictionary/wiktionary/fr/definition/rien`
    - `http://localhost:8081/v1/dictionary/wiktionary/languages`
    - `http://localhost:8081/v1/dictionary/wiktionary/langs/definition`

- #### Oxford Endpoints

  - `http://localhost:8081/v1/dictionary/oxford/{language_code}/definition/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/oxford/{language_code}/synonyms/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/oxford/{language_code}/antonyms/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/oxford/{language_code}/pronunciations/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/oxford/{language_code}/frequency/{word}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/oxford/{language_code}/frequency/{word}/{lexicalCategory}`\
  **Method**: `GET`\
  **Language Code**: IANA standards

  - `http://localhost:8081/v1/dictionary/oxford/languages`\
  **Method**: `GET`

  - `http://localhost:8081/v1/dictionary/oxford/langs/{endpoint_name}`\
  **Method**: `GET`

Example endpoints:
- `http://localhost:8081/v1/dictionary/oxford/en/definition/horse`
- `http://localhost:8081/v1/dictionary/oxford/languages`
- `http://localhost:8081/v1/dictionary/oxford/langs/definition`

### NLP Service
- #### Compromise
  - `http://localhost:8082/v1/nlp/compromise/tags`\
  **Method**: `POST`\
  **Request Body Format**: `{ sentence: "{sentence to be tagged}" }`

Example endpoints:
- `http://localhost:8082/v1/nlp/compromise/tags`\
**Body** `{ sentence: "Hello world! This is a test sentence" }`

### Translation Service
- #### General

  - `http://localhost:8083/v1/translation/translate/{source_lang}-{target_lang}`\
  **Method**: `POST`\
  **Request Body Format**: `{ text: "text to be translated"}`\
  **Language Code**: ISO 639-1 (2-lettered language codes)

  - `http://localhost:8083/v1/translation/detect`\
  **Method**: `POST`\
  **Request Body Format**: `{ text: "text for which language is to be detected"}`\
  **Language Code**: ISO 639-1 (2-lettered language codes), ISO 639-2 (3-lettered language code)

  - `http://localhost:8083/v1/translation/translate/{target_lang}`\
  **Method**: `POST`\
  **Request Body Format**: `{ text: "text to be translated"}`\
  **Language Code**: ISO 639-1 (2-lettered language codes)

  - `http://localhost:8083/v1/translation/langs/translate`\
  **Method**: `GET`

  Example endpoints:
    - `http://localhost:8083/v1/translation/translate/en-de`\
    **Body** `{ text: "This is the text to be translated" }`
    - `http://localhost:8083/v1/translation/detect`\
    **Body** `{ text: "This is the text for which the language is to be detected" }`
    - `http://localhost:8083/v1/translation/translate/de`\
    **Body** `{ text: "This is the text to be translated" }`
    - `http://localhost:8083/v1/translation/languages`\

- #### Yandex

  - `http://localhost:8083/v1/translation/yandex/translate/{source_lang}-{target_lang}`\
  **Method**: `POST`\
  **Request Body Format**: `{ text: "text to be translated"}`\
  **Language Code**: ISO 639-1 (2-lettered language codes)

  - `http://localhost:8083/v1/translation/yandex/detect`\
  **Method**: `POST`\
  **Request Body Format**: `{ text: "text for which language is to be detected"}`\
  **Language Code**: ISO 639-1 (2-lettered language codes)

  - `http://localhost:8083/v1/translation/yandex/translate/{target_lang}`\
  **Method**: `POST`\
  **Request Body Format**: `{ text: "text to be translated"}`\
  **Language Code**: ISO 639-1 (2-lettered language codes)

  - `http://localhost:8083/v1/translation/yandex/languages`\
  **Method**: `GET`

  - `http://localhost:8083/v1/translation/yandex/langs/translate`\
  **Method**: `GET`

  Example endpoints:
    - `http://localhost:8083/v1/translation/yandex/translate/en-de`\
    **Body** `{ text: "This is the text to be translated" }`
    - `http://localhost:8083/v1/translation/yandex/detect`\
    **Body** `{ text: "This is the text for which the language is to be detected" }`
    - `http://localhost:8083/v1/translation/yandex/translate/de`\
    **Body** `{ text: "This is the text to be translated" }`
    - `http://localhost:8083/v1/translation/yandex/languages`\

- #### Google

  - `http://localhost:8083/v1/translation/google/translate/{target_lang}`\
  **Method**: `POST`\
  **Request Body Format**: `{ text: "text to be translated"}`\
  **Language Code**: ISO 639-1 (2-lettered language codes), ISO 639-2 (3-lettered language code)

  - `http://localhost:8083/v1/translation/google/detect`\
  **Method**: `POST`\
  **Request Body Format**: `{ text: "text for which language is to be detected"}`\
  **Language Code**: ISO 639-1 (2-lettered language codes), ISO 639-2 (3-lettered language code)

  - `http://localhost:8083/v1/translation/google/languages`\
  **Method**: `GET`

  - `http://localhost:8083/v1/translation/google/languages/{lang}`\
  **Method**: `GET`\
  **Language Code**: ISO 639-1 (2-lettered language codes), ISO 639-2 (3-lettered language code)

  - `http://localhost:8083/v1/translation/google/langs/translate`\
  **Method**: `GET`

  Example endpoints:
    - `http://localhost:8083/v1/translation/google/translate/en`\
    **Body** `{ text: "This is the text to be translated" }`
    - `http://localhost:8083/v1/translation/google/detect`\
    **Body** `{ text: "This is the text for which the language is to be detected" }`
    - `http://localhost:8083/v1/translation/google/languages`\
    - `http://localhost:8083/v1/translation/google/languages/fr`\

## Running Tests

Tests for these endpoints lie in -
- `share/dictionary/tests/` - Tests for dictionary endpoints
- `share/nlp/tests/` - Tests for nlp endpoints
- `share/translation/tests/` - Tests for translation endpoints


There are 3 kinds of tests for each service -
- **Unit Tests** - Tests for individual functions
- **Integration Tests** - Testing the overall functioning of the endpoint (using mock test servers)
- **Contract Tests** - Testing if the external service provides data with the expected structure

There are several ways of running the tests -
- Running all `Unit` and `Integration` tests of all services togther
```
npm test
```
- Running all `Contract` tests of all services together
```
npm run test-contract
```
- Running all `Unit` and `Integration` tests of a particular service
```
// for dictionary service
npm run test-dictionary

// for nlp service
npm run test-nlp

// for translation service
npm run test-translation
```
- Running all `Contract` tests of a particular service
```
// for dictionary service
npm run test-dictionary-contract

// for nlp service
npm run test-nlp-contract

// for translation service
npm run test-translation-contract
```
- To run a particular test
```
node /relative/path/to/the/test/file
```
**Note** that all the above commands for running tests should be run at the root of the repository

## Documentation
Learn more about the service and the endpoints, in its documentation, which can be found [here](https://app.swaggerhub.com/apis/kunal4/fluid-adaptive-content-service/1.0.0).

## Notes for use of third-party services
The API serves as a useful wrapper around several third-party services -
- [Oxford](https://developer.oxforddictionaries.com/)
- [Wiktionary (word-definition)](https://www.npmjs.com/package/word-definition)
- [Compromise](https://github.com/spencermountain/compromise)
- [Yandex](https://tech.yandex.com/translate/)
- [Google](https://cloud.google.com/translate/)

Make sure you read their **Terms of Conditions** and their **Branding Requirements** for the use of the service they provide.

### Oxford
- [Terms and Conditions](https://developer.oxforddictionaries.com/api-terms-and-conditions)
- [Branding Resources](https://developer.oxforddictionaries.com/branding-resources)

### Wiktionary
- [Terms and Conditions](https://foundation.wikimedia.org/wiki/Terms_of_Use/en)

### Yandex
- [Terms of use](https://yandex.com/legal/translate_api/)
- [Requirements for use](https://tech.yandex.com/translate/doc/dg/concepts/design-requirements-docpage/)

### Google
- [Terms of service](https://cloud.google.com/terms/)
- [Attribution Requirements](https://cloud.google.com/translate/attribution)