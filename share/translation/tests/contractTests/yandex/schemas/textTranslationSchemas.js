"use strict";

var commonSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "type": "object",
        "required": ["code", "lang", "text"],
        "properties": {
            "code": { "type": "number" },
            "text": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "lang": {
                "type": "string",
                "pattern": "^(\\w+)-(\\w+)$"
            }
        }
    },
    error: commonSchemas.error
};
