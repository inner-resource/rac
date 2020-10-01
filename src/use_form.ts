import { useState, Dispatch, SetStateAction } from "react";

export type ParseableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | {}
  | Array<any>;

export type FormAttrType<T> = keyof T | Array<string | number>;

export type Form<T> = {
  object: T;
  modelName?: string;
  set: Dispatch<SetStateAction<T>>;
  update: (setter: (f: T) => void) => void;
  updateObject: (attr: FormAttrType<T>, value: ParseableValue) => void;
  getValue: (attr: FormAttrType<T>) => ParseableValue;
  resetForm: () => void;
};

export function isForm<T>(arg: any): arg is Form<T> {
  return (
    arg.object !== undefined &&
    arg.modelName !== undefined &&
    arg.getValue !== undefined &&
    arg.resetForm !== undefined
  );
}

/**
 * Formオブジェクトに値を設定するhooks.
 * ジェネリクスでフォームのtypeを指定する.
 *
 * @param initialForm 初期値.
 * @param modelName
 */
export function useForm<T>(initialForm: T, modelName?: string): Form<T> {
  const [form, setForm] = useState<T>(initialForm);

  const resetForm = () => {
    setForm(() => initialForm);
  };

  const copyForm = (): T => {
    let copyForm = Object.assign({}, form);
    return copyForm;
  };

  /**
   * マニュアルでattributeを更新する
   * @param setter 設定するメソッド
   */
  const updateForm = (setter: (f: T) => void): void => {
    let copledForm: T = copyForm();
    setter(copledForm!);
    setForm(() => copledForm!);
  };

  const updateObject = (attr: FormAttrType<T>, value: ParseableValue): void => {
    let copledForm: T = copyForm();
    if (copledForm instanceof Object) {
      if (attr instanceof Array) {
        let selectObj = copledForm as { [key: string]: any };
        attr.map((a, index) => {
          if (index + 1 == attr.length) {
            selectObj[a] = value;
          } else {
            selectObj = selectObj[a] as { [key: string]: any };
          }
        });
      } else {
        let selectObj = copledForm as { [key: string]: any };
        selectObj[attr as string] = value;
      }
    } else {
      throw "updateArray method require form type object";
    }

    setForm(() => copledForm!);
  };

  const getObjectValue = (attr: FormAttrType<T>): ParseableValue => {
    let returnValue = null;
    if (form instanceof Object) {
      if (attr instanceof Array) {
        let selectObj = form as { [key: string]: any };
        attr.map((a, index) => {
          if (index + 1 == attr.length) {
            returnValue = selectObj[a];
          } else {
            selectObj = selectObj[a] as { [key: string]: any };
          }
        });
      } else {
        let selectObj = form as { [key: string]: any };
        returnValue = selectObj[attr as string];
      }
    } else {
      throw "updateArray method require form type object";
    }
    return returnValue;
  };

  const getValue = (attr: FormAttrType<T>): ParseableValue => {
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

export type NestedForm<U> = {
  object?: U;
  modelName?: string;
  updateObject: (attr: FormAttrType<U>, value: ParseableValue) => void;
  getValue: (attr: FormAttrType<U>) => ParseableValue;
};

export const useNestedForm = <T, U>(
  form: Form<T>,
  modelName: string
): NestedForm<U> => {
  const updateObject = (attr: FormAttrType<U>, value: ParseableValue) => {
    if (typeof attr == "string") {
      form.updateObject([modelName, attr], value);
    } else {
      form.updateObject(
        [modelName, ...(attr as Array<string | number>)],
        value
      );
    }
  };

  const getValue = (attr: FormAttrType<U>): ParseableValue => {
    if (typeof attr == "string") {
      return form.getValue([modelName, attr]);
    } else {
      return form.getValue([modelName, ...(attr as Array<string | number>)]);
    }
  };

  const getObject = (): U | undefined => {
    const object = form.getValue(modelName as FormAttrType<T>);
    if (object) {
      return object as U;
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

export const convertRansackQueryParams = <T>(searchForm: Form<T>): { q: T } => {
  return { q: searchForm.object };
};
