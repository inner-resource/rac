(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.objectToFormData = void 0;
    const snakeCase = require("lodash.snakecase");
    exports.objectToFormData = (obj, form, namespace) => {
        let fd = form || new FormData();
        let formKey;
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
                    obj[property].forEach((element) => {
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
});
