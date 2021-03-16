import { Dispatch, SetStateAction } from "react";
import { Form } from "./use_form";
import { IHttpClient } from "./http_interface";
export declare type BaseResponse = {
    message?: string;
};
export declare type ApiSet<T> = {
    loading: boolean;
    apiError: ApiError;
    response: T;
    setResponse: Dispatch<SetStateAction<T>>;
    isError: boolean;
    isSuccess: () => boolean;
    isFailure: () => boolean;
    statusCode: number;
};
export declare type IndexApiSet<T> = ApiSet<T> & {
    pageSet: PageSet;
    orderSet: OrderSet;
    setState: (state: Partial<IndexApiState>) => void;
};
/**
 * messagesにはエラーメッセージがすべて配列で入っている
 * detailsには{ modal_name: { attribute_name: message} }が入っている
 */
export declare type ApiError = {
    message: string;
    messages: string[];
    details: {
        [key: string]: {
            [key: string]: string;
        };
    };
};
export declare function useApiState(): [
    boolean,
    Dispatch<SetStateAction<boolean>>,
    ApiError,
    (error: any) => void,
    boolean,
    () => boolean,
    () => boolean,
    number
];
declare type RansackOrderParams = {
    s?: string;
};
export declare type IndexParams = {
    page: number;
    perPage: number;
    q?: RansackOrderParams;
};
export declare type PageSet = {
    page: number;
    setPage: (page: number) => void;
    perPage: number;
    setPerPage: (perPage: number) => void;
};
export declare type Order = "asc" | "desc";
export declare type OrderSet = {
    order: Order;
    orderBy: string;
    changeOrder: (attr: string) => void;
};
export declare type IndexApiState = {
    page: number;
    perPage: number;
    order: Order;
    orderBy: string;
};
/**
 * IndexでつかうApiSetを返す
 */
export declare function useIndexApi<T extends BaseResponse, U>(httpClient: IHttpClient, props: {
    initialResponse: T;
    initialState?: Partial<IndexApiState>;
    params?: U;
}): IndexApiSet<T> & {
    execute: (path: string, options?: {
        params?: U;
    }) => void;
};
export declare type ApiArgument<T> = {
    initialResponse: T;
};
export declare function useShowApi<T extends BaseResponse, U>(httpClient: IHttpClient, props: ApiArgument<T>): ApiSet<T> & {
    execute: (apiPath: string, params?: U) => void;
};
export declare function usePostApi<T extends BaseResponse, U>(httpClient: IHttpClient, props: ApiArgument<T>): ApiSet<T> & {
    execute: (apiPath: string, form?: Form<U>) => void;
};
export declare function usePatchApi<T extends BaseResponse, U>(httpClient: IHttpClient, props: ApiArgument<T>): ApiSet<T> & {
    execute: (apiPath: string, params?: U) => void;
};
export declare function useDeleteApi<T extends BaseResponse>(httpClient: IHttpClient, props: ApiArgument<T>): ApiSet<T> & {
    execute: (apiPath: string) => void;
};
export {};
