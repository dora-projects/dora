import { Client, Plugin } from "@doras/core";
import { logger } from "@doras/shared";
import { verifyBrowserConfig } from "./config";
import { BrowserConfig } from "./types";
import { BrowserTransport } from "./transport";
import { genUid } from "./user";

import {
  ResourcePlugin,
  XhrPlugin,
  ErrorPlugin,
  DevicePlugin,
  PerfumePlugin,
  VisitPlugin
} from "./plugins";

const defaultPlugins = [
  ResourcePlugin(),
  XhrPlugin(),
  ErrorPlugin(),
  DevicePlugin(),
  PerfumePlugin(),
  VisitPlugin()
];

const defaultConfig: BrowserConfig = {
  serverUrl: "",
  appEnv: "",
  appId: "",
  appVersion: "",
  debug: false,
  uid: genUid(),
  transfer: BrowserTransport
};

const version = "__buildVersion";
const bTime = "__buildTime";

export class Api {
  private app: Client | null = null;
  private readonly conf: BrowserConfig | null = null;
  private readonly plugins: Plugin[];

  constructor(readonly options: BrowserConfig) {
    if (!options.debug) {
      logger.disable();
    }

    if (!options.disableDefaultPlugins) {
      this.plugins = defaultPlugins;
    }

    const { config: conf } = verifyBrowserConfig(defaultConfig, options);
    this.conf = conf;
  }

  use(p: Plugin | Plugin[]) {
    this.plugins.concat(p);
  }

  isActive(): boolean {
    return !!this.app;
  }

  start(): Client {
    if (!this.app) {
      this.app = new Client(this.conf, this.plugins);
      logger.debug(`sdk v${version} build at ${bTime}`);
      return this.app;
    }
    return this.app;
  }

  stop(): void {}

  setUserID(id: string): void {}

  setMetadata(key: string, value: string): void {}

  event(key: string, payload: any): void {}

  handleError = (e: Error | ErrorEvent | PromiseRejectionEvent) => {};
}
