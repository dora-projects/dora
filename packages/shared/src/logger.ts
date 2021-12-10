// import { getGlobal } from "./dom";

// const g = getGlobal();
const PREFIX = "Dora";

const C = console;
const L = C.log;
const W = C.warn || L;
const E = C.error || L;

class Logger {
  private _enabled: boolean;

  public constructor() {
    this._enabled = true;
  }

  public disable(): void {
    this._enabled = false;
  }

  public enable(): void {
    this._enabled = true;
  }

  public debug(...args: any[]): void {
    if (!this._enabled) {
      return;
    }
    L(`${PREFIX}[Debug]: ${args.join(" ")}`);
  }

  public warn(...args: any[]): void {
    if (!this._enabled) {
      return;
    }
    W(`${PREFIX}[Warn]: ${args.join(" ")}`);
  }

  public error(...args: any[]): void {
    if (!this._enabled) {
      return;
    }
    E(`${PREFIX}[Error]: ${args.join(" ")}`);
  }
}
//
// g._dora = g._dora || {};
//
const logger = new Logger();

//   (g.__DORA__.logger as Logger) || (g.__DORA__.logger = new Logger());

export { logger };
