const snakeCase = require("lodash.snakecase");
export const objectToFormData = (
  obj: any,
  form?: FormData,
  namespace?: string
) => {
  let fd = form || new FormData();
  let formKey: string;

  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = snakeCase(namespace) + "[" + snakeCase(property) + "]";
      } else {
        formKey = snakeCase(property);
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (
        typeof obj[property] === "object" &&
        !(obj[property] instanceof File) &&
        !(obj[property] instanceof Array)
      ) {
        objectToFormData(obj[property], fd, property);
      } else if (obj[property] instanceof Array) {
        obj[property].forEach((element: any) => {
          fd.append(formKey + "[]", element);
        });
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
};
