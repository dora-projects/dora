import { getGlobal } from "./dom";
import { noop } from "./utils";

const prefix = "Dora";

export const infoLog = console.info.bind(
  console,
  `%c ${prefix}`,
  `font-size:12px`
);

export const log = getGlobal().__dora__?.logger || noop;
