"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertRansackQueryParams = exports.useNestedForm = exports.useForm = exports.isForm = void 0;
var react_1 = require("react");
function isForm(arg) {
    return (arg.object !== undefined &&
        arg.modelName !== undefined &&
        arg.getValue !== undefined &&
        arg.resetForm !== undefined);
}
exports.isForm = isForm;
/**
 * Formオブジェクトに値を設定するhooks.
 * ジェネリクスでフォームのtypeを指定する.
 *
 * @param initialForm 初期値.
 * @param modelName
 */
function useForm(initialForm, modelName) {
    var _a = (0, react_1.useState)(initialForm), form = _a[0], setForm = _a[1];
    var resetForm = function () {
        setForm(function () { return initialForm; });
    };
    var copyForm = function () {
        var copyForm = Object.assign({}, form);
        return copyForm;
    };
    /**
     * マニュアルでattributeを更新する
     * @param setter 設定するメソッド
     */
    var updateForm = function (setter) {
        var copledForm = copyForm();
        setter(copledForm);
        setForm(function () { return copledForm; });
    };
    /** @deprecated */
    var updateObject = function (attr, value) {
        var copledForm = copyForm();
        if (copledForm instanceof Object) {
            if (attr instanceof Array) {
                var selectObj_1 = copledForm;
                attr.map(function (a, index) {
                    if (index + 1 == attr.length) {
                        if (!value && (typeof value != "number" || isNaN(value))) {
                            selectObj_1[a] = "";
                        }
                        else {
                            selectObj_1[a] = value;
                        }
                    }
                    else {
                        selectObj_1 = selectObj_1[a];
                    }
                });
            }
            else {
                var selectObj = copledForm;
                if (!value && (typeof value != "number" || isNaN(value))) {
                    selectObj[attr] = "";
                }
                else {
                    selectObj[attr] = value;
                }
            }
        }
        else {
            throw "updateArray method require form type object";
        }
        setForm(function () { return copledForm; });
    };
    var newUpdateObject = function (attr, value) {
        var copiedForm = copyForm();
        if (copiedForm instanceof Object) {
            if (attr instanceof Array) {
                var selectObj_2 = copiedForm;
                attr.map(function (a, index) {
                    if (index + 1 == attr.length) {
                        if (typeof value === "boolean") {
                            selectObj_2[a] = value;
                        }
                        else if (!value && (typeof value != "number" || isNaN(value))) {
                            selectObj_2[a] = "";
                        }
                        else {
                            selectObj_2[a] = value;
                        }
                    }
                    else {
                        selectObj_2 = selectObj_2[a];
                    }
                });
            }
            else {
                var selectObj = copiedForm;
                if (typeof value === "boolean") {
                    selectObj[attr] = value;
                }
                else if (!value && (typeof value != "number" || isNaN(value))) {
                    selectObj[attr] = "";
                }
                else {
                    selectObj[attr] = value;
                }
            }
        }
        else {
            throw "updateArray method require form type object";
        }
        setForm(function () { return copiedForm; });
    };
    var getObjectValue = function (attr) {
        var returnValue = null;
        if (form instanceof Object) {
            if (attr instanceof Array) {
                var selectObj_3 = form;
                attr.map(function (a, index) {
                    if (index + 1 == attr.length) {
                        returnValue = selectObj_3[a];
                    }
                    else {
                        selectObj_3 = selectObj_3[a];
                    }
                });
            }
            else {
                var selectObj = form;
                returnValue = selectObj[attr];
            }
        }
        else {
            throw "updateArray method require form type object";
        }
        return returnValue;
    };
    var getValue = function (attr) {
        return getObjectValue(attr);
    };
    return {
        object: form,
        modelName: modelName,
        set: setForm,
        update: updateForm,
        updateObject: updateObject,
        newUpdateObject: newUpdateObject,
        getValue: getValue,
        resetForm: resetForm,
    };
}
exports.useForm = useForm;
var useNestedForm = function (form, modelName) {
    var updateObject = function (attr, value) {
        if (typeof attr == "string") {
            form.updateObject([modelName, attr], value);
        }
        else {
            form.updateObject(__spreadArray([modelName], attr, true), value);
        }
    };
    var getValue = function (attr) {
        if (typeof attr == "string") {
            return form.getValue([modelName, attr]);
        }
        else {
            return form.getValue(__spreadArray([modelName], attr, true));
        }
    };
    var getObject = function () {
        var object = form.getValue(modelName);
        if (object) {
            return object;
        }
        return undefined;
    };
    return {
        object: getObject(),
        modelName: modelName,
        updateObject: updateObject,
        getValue: getValue,
    };
};
exports.useNestedForm = useNestedForm;
var convertRansackQueryParams = function (searchForm) {
    return { q: searchForm.object };
};
exports.convertRansackQueryParams = convertRansackQueryParams;
