import { Client, StatField } from "@doras/core";
import { log, infoLog, getGlobal, noop } from "@doras/shared";
import { verifyBrowserConfig } from "./config";
import { BrowserConfig, UserConfig } from "./types";
import { BrowserTransport } from "./transport";
import {
  ApiPlugin,
  DevicePlugin,
  ErrorPlugin,
  PerfumePlugin,
  ResourcePlugin,
  VisitPlugin
} from "./plugins";

const global = getGlobal();

const Browser = {
  init: (config: UserConfig) => {
    if (global.__dora__) {
      log("init has been called.");
      return global.__dora__;
    }

    const defaultConfig: BrowserConfig = {
      appEnv: "",
      appId: "",
      appVersion: "",
      serverUrl: "",
      isSpa: true,
      debug: false,
      logger: infoLog,
      transfer: BrowserTransport,
      plugins: [
        ApiPlugin(),
        DevicePlugin(),
        ErrorPlugin(),
        PerfumePlugin(),
        ResourcePlugin(),
        VisitPlugin()
      ]
    };

    // log
    global.__dora__.logger = config.debug ? config.logger : noop;

    // merger config
    const { config: conf, pass } = verifyBrowserConfig(defaultConfig, config);
    if (!pass) return;

    // new Client
    const c = new Client(conf);
    global.__dora__ = c;

    log("sdk ready!");

    return c;
  },
  stat: (data: StatField) => {
    if (!global.__dora__) {
      log("please call init first.");
      return global.__dora__;
    }
    return global.__dora__.statistic(data);
  }
};

export default Browser;
export * from "./plugins";
