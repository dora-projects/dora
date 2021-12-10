export function isEmpty(value: any): boolean {
  return value === undefined || value === null || value === "";
}

export function isUrl(value: any): boolean {
  return /^http(s)*.+/.test(value);
}

export function isPath(value: any): boolean {
  return /^\/.*/.test(value);
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

export function isError(wat: any): boolean {
  switch (Object.prototype.toString.call(wat)) {
    case "[object Error]":
      return true;
    case "[object Exception]":
      return true;
    case "[object DOMException]":
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}

export function isInstanceOf(wat: any, base: any): boolean {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}

export function getFirst(arr: any[]) {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr[0];
  }
  return null;
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

export function parseUrl(url: string): {
  host?: string;
  path?: string;
  protocol?: string;
  relative?: string;
} {
  if (typeof url !== "string") {
    return {};
  }

  const match = url.match(
    /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
  );

  if (!match) {
    return {};
  }

  const query = match[6] || "";
  const fragment = match[8] || "";
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment
  };
}

export function timeout(ms) {
  const p = {} as {
    start: () => Promise<any>;
    timer: any;
    cancel: (err?) => void;
  };

  p.start = () =>
    new Promise(function (resolve, reject) {
      p.timer = setTimeout(function () {
        resolve(undefined);
      }, ms);

      p.cancel = function (err) {
        p.timer && clearTimeout(p.timer);
        reject(err || new Error("cancel"));
      };
    });

  return p;
}

export function noop() {}

export function createUUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  const s = [] as any;
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  const uuid = s.join("");
  return uuid;
}

export function isPrimitive(wat: any): boolean {
  return wat === null || (typeof wat !== "object" && typeof wat !== "function");
}

export function errorFormat(err): { error: string; stack: string } {
  const detail = {
    error: null,
    stack: null
  };

  if (isPrimitive(err)) {
    detail.error = err || null;
  } else {
    try {
      detail.error = err.message;
      detail.stack = err.stack;
    } catch (_) {}
  }

  if (!detail.error) {
    detail.error = createSummary(detail.stack, 120);
  }

  return detail;
}

export function createSummary(content: string, len: number): string {
  if (!content || !isString(content)) return null;
  return content.substr(0, len);
}

export function numFixed(num: any, digit: number): number {
  if (isNaN(num)) return 0;
  return +num.toFixed(digit);
}

export function isContains(obj: Record<string, any>, keys: string[]) {
  const objKeys = Object.keys(obj);
  return keys.every((k) => objKeys.includes(k));
}
