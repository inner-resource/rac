"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteApi = exports.usePatchApi = exports.usePostApi = exports.useShowApi = exports.useIndexApi = exports.useApiState = void 0;
var react_1 = require("react");
var snakeCase = require("lodash.snakecase");
function useApiState() {
    var _a = react_1.useState(false), loading = _a[0], setLoading = _a[1];
    var _b = react_1.useState({
        message: "",
        messages: [],
        details: {},
    }), apiError = _b[0], setApiError = _b[1];
    var _c = react_1.useState(false), isError = _c[0], setIsError = _c[1];
    var _d = react_1.useState(0), statusCode = _d[0], setStatusCode = _d[1];
    var handleError = function (error) {
        var _a;
        setStatusCode((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status);
        if (error && error.response) {
            setApiError(function () { return error.response.data; });
            setIsError(true);
        }
    };
    var isSuccess = function () {
        return !loading && statusCode >= 200 && statusCode < 300;
    };
    var isFailure = function () {
        return !loading && statusCode >= 300;
    };
    react_1.useEffect(function () {
        if (loading) {
            // ロード開始時にエラーを消す
            setApiError({ messages: [], details: {}, message: "" });
            setIsError(false);
        }
    }, [loading]);
    return [
        loading,
        setLoading,
        apiError,
        handleError,
        isError,
        isSuccess,
        isFailure,
        statusCode,
        setStatusCode,
    ];
}
exports.useApiState = useApiState;
var IndexApiAction;
(function (IndexApiAction) {
    IndexApiAction["SET_PAGE"] = "SET_PAGE";
    IndexApiAction["SET_PER_PAGE"] = "SET_PER_PAGE";
    IndexApiAction["SET_ORDER"] = "SET_ORDER";
    IndexApiAction["SET_ORDER_BY"] = "SET_ORDER_BY";
    IndexApiAction["SET_STATE"] = "SET_STATE";
})(IndexApiAction || (IndexApiAction = {}));
var initialIndexState = {
    page: 1,
    perPage: 20,
    order: "desc",
    orderBy: "createdAt",
};
var indexReducer = function (state, action) {
    switch (action.type) {
        case IndexApiAction.SET_PAGE:
            return __assign(__assign({}, state), { page: action.payload });
        case IndexApiAction.SET_PER_PAGE:
            return __assign(__assign({}, state), { perPage: action.payload });
        case IndexApiAction.SET_ORDER:
            return __assign(__assign({}, state), { order: action.payload });
        case IndexApiAction.SET_ORDER_BY:
            return __assign(__assign({}, state), { orderBy: action.payload });
        case IndexApiAction.SET_STATE:
            return __assign(__assign({}, state), action.payload);
        default:
            return state;
    }
};
/**
 * IndexでつかうApiSetを返す
 */
function useIndexApi(httpClient, props) {
    var _this = this;
    var _a = useApiState(), loading = _a[0], setLoading = _a[1], apiError = _a[2], handleError = _a[3], isError = _a[4], isSuccess = _a[5], isFailure = _a[6], statusCode = _a[7], setStatusCode = _a[8];
    var _b = react_1.useState(props.initialResponse), response = _b[0], setResponse = _b[1];
    var _c = react_1.useReducer(indexReducer, props.initialState
        ? __assign(__assign({}, initialIndexState), props.initialState) : initialIndexState), indexApiState = _c[0], dispatch = _c[1];
    var setPage = function (page) {
        dispatch({ type: IndexApiAction.SET_PAGE, payload: page });
    };
    var setPerPage = function (perPage) {
        dispatch({ type: IndexApiAction.SET_PER_PAGE, payload: perPage });
    };
    var setOrder = function (order) {
        dispatch({ type: IndexApiAction.SET_ORDER, payload: order });
    };
    var setOrderBy = function (orderBy) {
        dispatch({ type: IndexApiAction.SET_ORDER_BY, payload: orderBy });
    };
    var setState = function (state) {
        dispatch({ type: IndexApiAction.SET_STATE, payload: state });
    };
    /**
     * ソート条件を変更する
     *
     * @param attr ソートするカラム
     */
    var changeOrder = function (attr) {
        if (indexApiState.orderBy === attr) {
            switch (indexApiState.order) {
                case "asc":
                    setOrder("desc");
                    break;
                case "desc":
                    setOrder("asc");
                    break;
            }
        }
        else {
            setOrderBy(attr);
            setOrder("asc");
        }
    };
    var pageSet = {
        page: indexApiState.page,
        setPage: setPage,
        perPage: indexApiState.perPage,
        setPerPage: setPerPage,
    };
    var orderSet = {
        order: indexApiState.order,
        orderBy: indexApiState.orderBy,
        changeOrder: changeOrder,
    };
    var execute = function (path, options) { return __awaiter(_this, void 0, void 0, function () {
        var params, result, data_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (loading) {
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = __assign({
                        page: pageSet.page,
                        perPage: pageSet.perPage,
                        q: {
                            s: snakeCase(indexApiState.orderBy) + " " + indexApiState.order,
                        },
                    });
                    if (options === null || options === void 0 ? void 0 : options.params) {
                        // 追加でparamsの指定がある場合
                        params = __assign(__assign({}, params), options.params);
                        params.q = __assign(__assign({}, params.q), { s: snakeCase(indexApiState.orderBy) + " " + indexApiState.order });
                    }
                    return [4 /*yield*/, httpClient.get(path, params)];
                case 2:
                    result = _a.sent();
                    setStatusCode(result.statusCode);
                    data_1 = result.data;
                    setResponse(function () { return data_1; });
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    handleError(e_1);
                    return [3 /*break*/, 4];
                case 4:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        loading: loading,
        apiError: apiError,
        response: response,
        setResponse: setResponse,
        execute: execute,
        pageSet: pageSet,
        orderSet: orderSet,
        setState: setState,
        isError: isError,
        isSuccess: isSuccess,
        isFailure: isFailure,
        statusCode: statusCode,
        setStatusCode: setStatusCode,
    };
}
exports.useIndexApi = useIndexApi;
function useShowApi(httpClient, props) {
    var _this = this;
    var _a = useApiState(), loading = _a[0], setLoading = _a[1], apiError = _a[2], handleError = _a[3], isError = _a[4], isSuccess = _a[5], isFailure = _a[6], statusCode = _a[7], setStatusCode = _a[8];
    var _b = react_1.useState(props.initialResponse), response = _b[0], setResponse = _b[1];
    var execute = react_1.useCallback(function (apiPath, params) { return __awaiter(_this, void 0, void 0, function () {
        var result, data_2, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, httpClient.get(apiPath, params)];
                case 2:
                    result = _a.sent();
                    setStatusCode(result.statusCode);
                    data_2 = result.data;
                    setResponse(function () { return data_2; });
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    handleError(e_2);
                    return [3 /*break*/, 4];
                case 4:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    return {
        loading: loading,
        apiError: apiError,
        response: response,
        setResponse: setResponse,
        execute: execute,
        isError: isError,
        isSuccess: isSuccess,
        isFailure: isFailure,
        statusCode: statusCode,
        setStatusCode: setStatusCode,
    };
}
exports.useShowApi = useShowApi;
function usePostApi(httpClient, props) {
    var _this = this;
    var _a = useApiState(), loading = _a[0], setLoading = _a[1], apiError = _a[2], handleError = _a[3], isError = _a[4], isSuccess = _a[5], isFailure = _a[6], statusCode = _a[7], setStatusCode = _a[8];
    var _b = react_1.useState(props.initialResponse), response = _b[0], setResponse = _b[1];
    var execute = function (apiPath, form) { return __awaiter(_this, void 0, void 0, function () {
        var result, data_3, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (loading) {
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, httpClient.post(apiPath, form === null || form === void 0 ? void 0 : form.object)];
                case 2:
                    result = _a.sent();
                    setStatusCode(result.statusCode);
                    data_3 = result.data;
                    setResponse(function () { return data_3; });
                    form === null || form === void 0 ? void 0 : form.resetForm();
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    handleError(e_3);
                    return [3 /*break*/, 4];
                case 4:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        loading: loading,
        apiError: apiError,
        response: response,
        setResponse: setResponse,
        execute: execute,
        isError: isError,
        isSuccess: isSuccess,
        isFailure: isFailure,
        statusCode: statusCode,
        setStatusCode: setStatusCode,
    };
}
exports.usePostApi = usePostApi;
function usePatchApi(httpClient, props) {
    var _this = this;
    var _a = useApiState(), loading = _a[0], setLoading = _a[1], apiError = _a[2], handleError = _a[3], isError = _a[4], isSuccess = _a[5], isFailure = _a[6], statusCode = _a[7], setStatusCode = _a[8];
    var _b = react_1.useState(props.initialResponse), response = _b[0], setResponse = _b[1];
    var execute = function (apiPath, params) { return __awaiter(_this, void 0, void 0, function () {
        var result, data_4, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (loading) {
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, httpClient.patch(apiPath, params)];
                case 2:
                    result = _a.sent();
                    setStatusCode(result.statusCode);
                    data_4 = result.data;
                    setResponse(function () { return data_4; });
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    handleError(e_4);
                    return [3 /*break*/, 4];
                case 4:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        loading: loading,
        apiError: apiError,
        response: response,
        setResponse: setResponse,
        execute: execute,
        isError: isError,
        isSuccess: isSuccess,
        isFailure: isFailure,
        statusCode: statusCode,
        setStatusCode: setStatusCode,
    };
}
exports.usePatchApi = usePatchApi;
function useDeleteApi(httpClient, props) {
    var _this = this;
    var _a = useApiState(), loading = _a[0], setLoading = _a[1], apiError = _a[2], handleError = _a[3], isError = _a[4], isSuccess = _a[5], isFailure = _a[6], statusCode = _a[7], setStatusCode = _a[8];
    var _b = react_1.useState(props.initialResponse), response = _b[0], setResponse = _b[1];
    var execute = function (apiPath) { return __awaiter(_this, void 0, void 0, function () {
        var result, data_5, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (loading) {
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, httpClient.delete(apiPath)];
                case 2:
                    result = _a.sent();
                    setStatusCode(result.statusCode);
                    data_5 = result.data;
                    setResponse(function () { return data_5; });
                    return [3 /*break*/, 4];
                case 3:
                    e_5 = _a.sent();
                    handleError(e_5);
                    return [3 /*break*/, 4];
                case 4:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        loading: loading,
        apiError: apiError,
        response: response,
        setResponse: setResponse,
        execute: execute,
        isError: isError,
        isSuccess: isSuccess,
        isFailure: isFailure,
        statusCode: statusCode,
        setStatusCode: setStatusCode,
    };
}
exports.useDeleteApi = useDeleteApi;
