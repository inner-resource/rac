(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "./utils", "./use_form"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDeleteApi = exports.usePatchApi = exports.usePostApi = exports.useShowApi = exports.useIndexApi = exports.useApiState = void 0;
    const react_1 = require("react");
    const utils_1 = require("./utils");
    const use_form_1 = require("./use_form");
    const snakeCase = require("lodash.snakecase");
    function useApiState() {
        const [loading, setLoading] = react_1.useState(false);
        const [apiError, setApiError] = react_1.useState({
            message: "",
            messages: [],
            details: {},
        });
        const [isError, setIsError] = react_1.useState(false);
        const handleError = (error) => {
            if (error && error.response) {
                if (error?.response?.status == 401) {
                    const message = error.response.data?.message
                        ? error.response.data?.message
                        : "認証エラーが発生しました。再度ログインしてください";
                    window.location.href = `/auth_error?message=${message}`;
                    return;
                }
                setApiError(() => error.response.data);
                setIsError(true);
            }
        };
        const isSuccess = () => {
            return !loading && !isError;
        };
        react_1.useEffect(() => {
            if (loading) {
                // ロード開始時にエラーを消す
                setApiError({ messages: [], details: {}, message: "" });
                setIsError(false);
            }
        }, [loading]);
        return [loading, setLoading, apiError, handleError, isError, isSuccess];
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
    const initialIndexState = {
        page: 1,
        perPage: 20,
        order: "desc",
        orderBy: "createdAt",
    };
    const indexReducer = (state, action) => {
        switch (action.type) {
            case IndexApiAction.SET_PAGE:
                return { ...state, page: action.payload };
            case IndexApiAction.SET_PER_PAGE:
                return { ...state, perPage: action.payload };
            case IndexApiAction.SET_ORDER:
                return { ...state, order: action.payload };
            case IndexApiAction.SET_ORDER_BY:
                return { ...state, orderBy: action.payload };
            case IndexApiAction.SET_STATE:
                return { ...state, ...action.payload };
            default:
                return state;
        }
    };
    /**
     * IndexでつかうApiSetを返す
     */
    function useIndexApi(httpClient, props) {
        const [loading, setLoading, apiError, handleError, isError, isSuccess,] = useApiState();
        const [response, setResponse] = react_1.useState(props.initialResponse);
        const [indexApiState, dispatch] = react_1.useReducer(indexReducer, props.initialState
            ? { ...initialIndexState, ...props.initialState }
            : initialIndexState);
        const setPage = (page) => {
            dispatch({ type: IndexApiAction.SET_PAGE, payload: page });
        };
        const setPerPage = (perPage) => {
            dispatch({ type: IndexApiAction.SET_PER_PAGE, payload: perPage });
        };
        const setOrder = (order) => {
            dispatch({ type: IndexApiAction.SET_ORDER, payload: order });
        };
        const setOrderBy = (orderBy) => {
            dispatch({ type: IndexApiAction.SET_ORDER_BY, payload: orderBy });
        };
        const setState = (state) => {
            dispatch({ type: IndexApiAction.SET_STATE, payload: state });
        };
        /**
         * ソート条件を変更する
         *
         * @param attr ソートするカラム
         */
        const changeOrder = (attr) => {
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
        const pageSet = {
            page: indexApiState.page,
            setPage: setPage,
            perPage: indexApiState.perPage,
            setPerPage: setPerPage,
        };
        const orderSet = {
            order: indexApiState.order,
            orderBy: indexApiState.orderBy,
            changeOrder: changeOrder,
        };
        const execute = async (path, options) => {
            if (loading) {
                return;
            }
            setLoading(true);
            try {
                let params = {
                    ...{
                        page: pageSet.page,
                        perPage: pageSet.perPage,
                        q: {
                            s: `${snakeCase(indexApiState.orderBy)} ${indexApiState.order}`,
                        },
                    },
                };
                if (options?.params) {
                    // 追加でparamsの指定がある場合
                    params = { ...params, ...options.params };
                    params.q = {
                        ...params.q,
                        s: `${snakeCase(indexApiState.orderBy)} ${indexApiState.order}`,
                    };
                }
                const result = await httpClient.get(path, params);
                const data = result.data;
                setResponse(() => data);
            }
            catch (e) {
                handleError(e);
            }
            setLoading(false);
        };
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
        };
    }
    exports.useIndexApi = useIndexApi;
    function useShowApi(httpClient, props) {
        const [loading, setLoading, apiError, handleError, isError, isSuccess,] = useApiState();
        const [response, setResponse] = react_1.useState(props.initialResponse);
        const execute = react_1.useCallback(async (apiPath, params) => {
            setLoading(true);
            try {
                const result = await httpClient.get(apiPath, params);
                const data = result.data;
                setResponse(() => data);
            }
            catch (e) {
                handleError(e);
            }
            setLoading(false);
        }, []);
        return {
            loading: loading,
            apiError: apiError,
            response: response,
            setResponse: setResponse,
            execute: execute,
            isError: isError,
            isSuccess: isSuccess,
        };
    }
    exports.useShowApi = useShowApi;
    function usePostApi(httpClient, props) {
        const [loading, setLoading, apiError, handleError, isError, isSuccess,] = useApiState();
        const [response, setResponse] = react_1.useState(props.initialResponse);
        const execute = async (apiPath, form) => {
            if (loading) {
                return;
            }
            setLoading(true);
            try {
                const result = await httpClient.post(apiPath, form?.object);
                const data = result.data;
                setResponse(() => data);
                form?.resetForm();
            }
            catch (e) {
                handleError(e);
            }
            setLoading(false);
        };
        return {
            loading: loading,
            apiError: apiError,
            response: response,
            setResponse: setResponse,
            execute: execute,
            isError: isError,
            isSuccess: isSuccess,
        };
    }
    exports.usePostApi = usePostApi;
    function usePatchApi(httpClient, props) {
        const [loading, setLoading, apiError, handleError, isError, isSuccess,] = useApiState();
        const [response, setResponse] = react_1.useState(props.initialResponse);
        const execute = async (apiPath, formOrParams) => {
            if (loading) {
                return;
            }
            setLoading(true);
            try {
                let params;
                if (use_form_1.isForm(formOrParams)) {
                    params = formOrParams.object;
                }
                else {
                    params = formOrParams;
                }
                const formData = utils_1.objectToFormData(params);
                const result = await httpClient.patch(apiPath, formData);
                const data = result.data;
                setResponse(() => data);
            }
            catch (e) {
                handleError(e);
            }
            setLoading(false);
        };
        return {
            loading: loading,
            apiError: apiError,
            response: response,
            setResponse: setResponse,
            execute: execute,
            isError: isError,
            isSuccess: isSuccess,
        };
    }
    exports.usePatchApi = usePatchApi;
    function useDeleteApi(httpClient, props) {
        const [loading, setLoading, apiError, handleError, isError, isSuccess,] = useApiState();
        const [response, setResponse] = react_1.useState(props.initialResponse);
        const execute = async (apiPath) => {
            if (loading) {
                return;
            }
            setLoading(true);
            try {
                const result = await httpClient.delete(apiPath);
                const data = result.data;
                setResponse(() => data);
            }
            catch (e) {
                handleError(e);
            }
            setLoading(false);
        };
        return {
            loading: loading,
            apiError: apiError,
            response: response,
            setResponse: setResponse,
            execute: execute,
            isError: isError,
            isSuccess: isSuccess,
        };
    }
    exports.useDeleteApi = useDeleteApi;
});
