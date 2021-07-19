import { getGlobal } from "./dom";
import { noop } from "./utils";

const prefix = "Dora";
const fmt = `font-size:14px; color:#3578e5;`;

const C = console;
const L = console.log;
const W = console.warn || L;
const E = console.error || L;

export const info = L.bind(C, `%c ${prefix} info:`, fmt);

export const warn = W.bind(C, `%c ${prefix} warn:`, fmt);

export const error = E.bind(C, `%c ${prefix} error:`, fmt);

export const userDebug = L.bind(C, `%c ${prefix} debug:`, fmt);

export const debug = (...args) => {
  const l = getGlobal().__dora__?.logger || noop;
  return l.apply(null, args);
};
