const prefix = "Dora";

export enum LEVEL {
  debug = 0,
  info,
  warn,
  error
}

// 默认 info
let userSetting = LEVEL.debug;
export const setLoggerLevel = (level: LEVEL) => {
  userSetting = level;
};

export function logger() {
  return {
    debug: defaultLogger("debug"),
    info: defaultLogger("info"),
    warn: defaultLogger("warn"),
    error: defaultLogger("error")
  };
}

export const noop = () => {};

function defaultLogger(type: string) {
  if (type === "debug" && LEVEL.debug >= userSetting) {
    return console.log.bind(console, `%c ${prefix}`, `font-size:16px`);
  }
  if (LEVEL[type] >= userSetting) {
    return console[type].bind(console, `%c ${prefix}`, `font-size:16px`);
  }
  return noop;
}
