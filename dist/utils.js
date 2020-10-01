"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToFormData = void 0;
var snakeCase = require("lodash.snakecase");
exports.objectToFormData = function (obj, form, namespace) {
    var fd = form || new FormData();
    var formKey;
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (namespace) {
                formKey = snakeCase(namespace) + "[" + snakeCase(property) + "]";
            }
            else {
                formKey = snakeCase(property);
            }
            // if the property is an object, but not a File,
            // use recursivity.
            if (typeof obj[property] === "object" &&
                !(obj[property] instanceof File) &&
                !(obj[property] instanceof Array)) {
                exports.objectToFormData(obj[property], fd, property);
            }
            else if (obj[property] instanceof Array) {
                obj[property].forEach(function (element) {
                    fd.append(formKey + "[]", element);
                });
            }
            else {
                // if it's a string or a File object
                fd.append(formKey, obj[property]);
            }
        }
    }
    return fd;
};
