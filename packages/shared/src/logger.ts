const PREFIX = "Dora";

const C = console;
const log = C.log;
const warn = C.warn || log;
const error = C.error || log;

export enum Level {
  DEBUG,
  WARN,
  ERROR
}

class Logger {
  private _level: Level;
  private _enabled: boolean;

  public constructor() {
    this._level = Level.WARN;
    this._enabled = true;
  }

  public setLevel(l: Level): void {
    this._level = l;
  }

  public disable(): void {
    this._enabled = false;
  }

  public enable(): void {
    this._enabled = true;
  }

  public debug(...args: any[]): void {
    if (!this._enabled) return;
    if (this._level >= Level.DEBUG) {
      log(`[${PREFIX}] ${args.join(" ")}`);
    }
  }

  public warn(...args: any[]): void {
    if (!this._enabled) return;
    if (this._level >= Level.WARN) {
      warn(`[${PREFIX}] ${args.join(" ")}`);
    }
  }

  public error(...args: any[]): void {
    if (!this._enabled) return;
    if (this._level >= Level.ERROR) {
      error(`[${PREFIX}] ${args.join(" ")}`);
    }
  }
}

const logger = new Logger();

export { logger };
