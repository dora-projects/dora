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
        resolve();
      }, ms);

      p.cancel = function (err) {
        p.timer && clearTimeout(p.timer);
        reject(err || new Error("cancel"));
      };
    });

  return p;
}

export function noop() {}
