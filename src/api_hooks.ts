import {
  Dispatch,
  useState,
  useEffect,
  useCallback,
  useReducer,
  SetStateAction,
} from "react";

import { objectToFormData } from "./utils";
import { Form, isForm } from "./use_form";
import { IHttpClient } from "./http_interface";
const snakeCase = require("lodash.snakecase");

export type BaseResponse = {
  message?: string;
};

export type ApiSet<T> = {
  loading: boolean;
  apiError: ApiError;
  response: T;
  setResponse: Dispatch<SetStateAction<T>>;
  isError: boolean;
  isSuccess: () => boolean;
};

export type IndexApiSet<T> = ApiSet<T> & {
  pageSet: PageSet;
  orderSet: OrderSet;
  setState: (state: Partial<IndexApiState>) => void;
};

/**
 * messagesにはエラーメッセージがすべて配列で入っている
 * detailsには{ modal_name: { attribute_name: message} }が入っている
 */
export type ApiError = {
  message: string;
  messages: string[];
  details: { [key: string]: { [key: string]: string } };
};

export function useApiState(): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  ApiError,
  (error: any) => void,
  boolean,
  () => boolean
] {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<ApiError>({
    message: "",
    messages: [],
    details: {},
  });
  const [isError, setIsError] = useState<boolean>(false);

  const handleError = (error: any) => {
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

  useEffect(() => {
    if (loading) {
      // ロード開始時にエラーを消す
      setApiError({ messages: [], details: {}, message: "" });
      setIsError(false);
    }
  }, [loading]);

  return [loading, setLoading, apiError, handleError, isError, isSuccess];
}

type RansackOrderParams = {
  s?: string;
};

export type IndexParams = {
  page: number;
  perPage: number;
  q?: RansackOrderParams;
};

export type PageSet = {
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
};

export type Order = "asc" | "desc";

export type OrderSet = {
  order: Order;
  orderBy: string;
  changeOrder: (attr: string) => void;
};

export type IndexApiState = {
  page: number;
  perPage: number;
  order: Order;
  orderBy: string;
};

enum IndexApiAction {
  SET_PAGE = "SET_PAGE",
  SET_PER_PAGE = "SET_PER_PAGE",
  SET_ORDER = "SET_ORDER",
  SET_ORDER_BY = "SET_ORDER_BY",
  SET_STATE = "SET_STATE",
}

type SetPageAction = { type: IndexApiAction.SET_PAGE; payload: number };
type SetPerPageAction = { type: IndexApiAction.SET_PER_PAGE; payload: number };
type SetOrderAction = { type: IndexApiAction.SET_ORDER; payload: Order };
type SetOrderByAction = { type: IndexApiAction.SET_ORDER_BY; payload: string };
type SetAllStateAction = {
  type: IndexApiAction.SET_STATE;
  payload: Partial<IndexApiState>;
};
type IndexApiActionType =
  | SetPageAction
  | SetPerPageAction
  | SetOrderAction
  | SetOrderByAction
  | SetAllStateAction;

const initialIndexState: IndexApiState = {
  page: 1,
  perPage: 20,
  order: "desc",
  orderBy: "createdAt",
};

const indexReducer = (
  state: IndexApiState,
  action: IndexApiActionType
): IndexApiState => {
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
export function useIndexApi<T extends BaseResponse, U>(
  httpClient: IHttpClient,
  props: {
    initialResponse: T;
    initialState?: Partial<IndexApiState>;
    params?: U;
  }
): IndexApiSet<T> & {
  execute: (path: string, options?: { params?: U }) => void;
} {
  const [
    loading,
    setLoading,
    apiError,
    handleError,
    isError,
    isSuccess,
  ] = useApiState();
  const [response, setResponse] = useState<T>(props.initialResponse);
  const [indexApiState, dispatch] = useReducer(
    indexReducer,
    props.initialState
      ? { ...initialIndexState, ...props.initialState }
      : initialIndexState
  );

  const setPage = (page: number) => {
    dispatch({ type: IndexApiAction.SET_PAGE, payload: page });
  };
  const setPerPage = (perPage: number) => {
    dispatch({ type: IndexApiAction.SET_PER_PAGE, payload: perPage });
  };
  const setOrder = (order: Order) => {
    dispatch({ type: IndexApiAction.SET_ORDER, payload: order });
  };
  const setOrderBy = (orderBy: string) => {
    dispatch({ type: IndexApiAction.SET_ORDER_BY, payload: orderBy });
  };
  const setState = (state: Partial<IndexApiState>) => {
    dispatch({ type: IndexApiAction.SET_STATE, payload: state });
  };

  /**
   * ソート条件を変更する
   *
   * @param attr ソートするカラム
   */
  const changeOrder = (attr: string) => {
    if (indexApiState.orderBy === attr) {
      switch (indexApiState.order) {
        case "asc":
          setOrder("desc");
          break;
        case "desc":
          setOrder("asc");
          break;
      }
    } else {
      setOrderBy(attr);
      setOrder("asc");
    }
  };

  const pageSet: PageSet = {
    page: indexApiState.page,
    setPage: setPage,
    perPage: indexApiState.perPage,
    setPerPage: setPerPage,
  };

  const orderSet: OrderSet = {
    order: indexApiState.order,
    orderBy: indexApiState.orderBy,
    changeOrder: changeOrder,
  };

  const execute = async (path: string, options?: { params?: U }) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      let params: IndexParams = {
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
      const data: T = result.data;

      setResponse(() => data);
    } catch (e) {
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

export type ApiArgument<T> = {
  initialResponse: T;
};

export function useShowApi<T extends BaseResponse, U>(
  httpClient: IHttpClient,
  props: ApiArgument<T>
): ApiSet<T> & { execute: (apiPath: string, params?: U) => void } {
  const [
    loading,
    setLoading,
    apiError,
    handleError,
    isError,
    isSuccess,
  ] = useApiState();
  const [response, setResponse] = useState<T>(props.initialResponse);

  const execute = useCallback(async (apiPath: string, params?: U) => {
    setLoading(true);
    try {
      const result = await httpClient.get(apiPath, params);
      const data: T = result.data;
      setResponse(() => data);
    } catch (e) {
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

export function usePostApi<T extends BaseResponse, U>(
  httpClient: IHttpClient,
  props: ApiArgument<T>
): ApiSet<T> & { execute: (apiPath: string, form?: Form<U>) => void } {
  const [
    loading,
    setLoading,
    apiError,
    handleError,
    isError,
    isSuccess,
  ] = useApiState();
  const [response, setResponse] = useState<T>(props.initialResponse);

  const execute = async (apiPath: string, form?: Form<U>) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const result = await httpClient.post(apiPath, form?.object);
      const data: T = result.data;
      setResponse(() => data);
      form?.resetForm();
    } catch (e) {
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

export function usePatchApi<T extends BaseResponse, U>(
  httpClient: IHttpClient,
  props: ApiArgument<T>
): ApiSet<T> & {
  execute: (apiPath: string, params?: U) => void;
} {
  const [
    loading,
    setLoading,
    apiError,
    handleError,
    isError,
    isSuccess,
  ] = useApiState();
  const [response, setResponse] = useState<T>(props.initialResponse);

  const execute = async (apiPath: string, params?: U) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const formData = objectToFormData(params);
      const result = await httpClient.patch(apiPath, formData);
      const data: T = result.data;
      setResponse(() => data);
    } catch (e) {
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

export function useDeleteApi<T extends BaseResponse>(
  httpClient: IHttpClient,
  props: ApiArgument<T>
): ApiSet<T> & { execute: (apiPath: string) => void } {
  const [
    loading,
    setLoading,
    apiError,
    handleError,
    isError,
    isSuccess,
  ] = useApiState();
  const [response, setResponse] = useState<T>(props.initialResponse);

  const execute = async (apiPath: string) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const result = await httpClient.delete(apiPath);
      const data: T = result.data;
      setResponse(() => data);
    } catch (e) {
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
