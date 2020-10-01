"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
    var _a = react_1.useState(initialForm), form = _a[0], setForm = _a[1];
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
    var updateObject = function (attr, value) {
        var copledForm = copyForm();
        if (copledForm instanceof Object) {
            if (attr instanceof Array) {
                var selectObj_1 = copledForm;
                attr.map(function (a, index) {
                    if (index + 1 == attr.length) {
                        selectObj_1[a] = value;
                    }
                    else {
                        selectObj_1 = selectObj_1[a];
                    }
                });
            }
            else {
                var selectObj = copledForm;
                selectObj[attr] = value;
            }
        }
        else {
            throw "updateArray method require form type object";
        }
        setForm(function () { return copledForm; });
    };
    var getObjectValue = function (attr) {
        var returnValue = null;
        if (form instanceof Object) {
            if (attr instanceof Array) {
                var selectObj_2 = form;
                attr.map(function (a, index) {
                    if (index + 1 == attr.length) {
                        returnValue = selectObj_2[a];
                    }
                    else {
                        selectObj_2 = selectObj_2[a];
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
        getValue: getValue,
        resetForm: resetForm,
    };
}
exports.useForm = useForm;
exports.useNestedForm = function (form, modelName) {
    var updateObject = function (attr, value) {
        if (typeof attr == "string") {
            form.updateObject([modelName, attr], value);
        }
        else {
            form.updateObject(__spreadArrays([modelName], attr), value);
        }
    };
    var getValue = function (attr) {
        if (typeof attr == "string") {
            return form.getValue([modelName, attr]);
        }
        else {
            return form.getValue(__spreadArrays([modelName], attr));
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
exports.convertRansackQueryParams = function (searchForm) {
    return { q: searchForm.object };
};
