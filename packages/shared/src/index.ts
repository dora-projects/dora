export function isEmpty(value: any): boolean {
  return value === undefined || value === null || value === "";
}

export function isUrl(value: any): boolean {
  return /^http(s)*.+/.test(value);
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

export function isNumber(value: any): value is number {
  return typeof value === "number" && parseInt("" + value, 10) === value;
}

export function isFunction(value: any): value is Function {
  return typeof value === "function";
}

export function isObject(value: any): value is Object {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export function isPromise(value: any): value is Promise<any> {
  return value instanceof Promise;
}

export function isEmptyObject(obj: any): boolean {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
}

export function decorator(
  source: any,
  name: string,
  behavior: (origin) => any
) {
  if (!(name in source)) return;

  const original = source[name];

  const wrapped = behavior(original);
  source[name] = wrapped;

  return original;
}
