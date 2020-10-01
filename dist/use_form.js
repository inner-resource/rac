(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertRansackQueryParams = exports.useNestedForm = exports.useForm = exports.isForm = void 0;
    const react_1 = require("react");
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
        const [form, setForm] = react_1.useState(initialForm);
        const resetForm = () => {
            setForm(() => initialForm);
        };
        const copyForm = () => {
            let copyForm = Object.assign({}, form);
            return copyForm;
        };
        /**
         * マニュアルでattributeを更新する
         * @param setter 設定するメソッド
         */
        const updateForm = (setter) => {
            let copledForm = copyForm();
            setter(copledForm);
            setForm(() => copledForm);
        };
        const updateObject = (attr, value) => {
            let copledForm = copyForm();
            if (copledForm instanceof Object) {
                if (attr instanceof Array) {
                    let selectObj = copledForm;
                    attr.map((a, index) => {
                        if (index + 1 == attr.length) {
                            selectObj[a] = value;
                        }
                        else {
                            selectObj = selectObj[a];
                        }
                    });
                }
                else {
                    let selectObj = copledForm;
                    selectObj[attr] = value;
                }
            }
            else {
                throw "updateArray method require form type object";
            }
            setForm(() => copledForm);
        };
        const getObjectValue = (attr) => {
            let returnValue = null;
            if (form instanceof Object) {
                if (attr instanceof Array) {
                    let selectObj = form;
                    attr.map((a, index) => {
                        if (index + 1 == attr.length) {
                            returnValue = selectObj[a];
                        }
                        else {
                            selectObj = selectObj[a];
                        }
                    });
                }
                else {
                    let selectObj = form;
                    returnValue = selectObj[attr];
                }
            }
            else {
                throw "updateArray method require form type object";
            }
            return returnValue;
        };
        const getValue = (attr) => {
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
    exports.useNestedForm = (form, modelName) => {
        const updateObject = (attr, value) => {
            if (typeof attr == "string") {
                form.updateObject([modelName, attr], value);
            }
            else {
                form.updateObject([modelName, ...attr], value);
            }
        };
        const getValue = (attr) => {
            if (typeof attr == "string") {
                return form.getValue([modelName, attr]);
            }
            else {
                return form.getValue([modelName, ...attr]);
            }
        };
        const getObject = () => {
            const object = form.getValue(modelName);
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
    exports.convertRansackQueryParams = (searchForm) => {
        return { q: searchForm.object };
    };
});
