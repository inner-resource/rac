import { Dispatch, SetStateAction } from "react";
export declare type ParseableValue = string | number | boolean | null | undefined | {} | Array<any>;
export declare type FormAttrType<T> = keyof T | Array<string | number>;
export declare type Form<T> = {
    object: T;
    modelName?: string;
    set: Dispatch<SetStateAction<T>>;
    update: (setter: (f: T) => void) => void;
    updateObject: (attr: FormAttrType<T>, value: ParseableValue) => void;
    getValue: (attr: FormAttrType<T>) => ParseableValue;
    resetForm: () => void;
};
export declare function isForm<T>(arg: any): arg is Form<T>;
/**
 * Formオブジェクトに値を設定するhooks.
 * ジェネリクスでフォームのtypeを指定する.
 *
 * @param initialForm 初期値.
 * @param modelName
 */
export declare function useForm<T>(initialForm: T, modelName?: string): Form<T>;
export declare type NestedForm<U> = {
    object?: U;
    modelName?: string;
    updateObject: (attr: FormAttrType<U>, value: ParseableValue) => void;
    getValue: (attr: FormAttrType<U>) => ParseableValue;
};
export declare const useNestedForm: <T, U>(form: Form<T>, modelName: string) => NestedForm<U>;
export declare const convertRansackQueryParams: <T>(searchForm: Form<T>) => {
    q: T;
};
