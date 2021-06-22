import { Client, StatField } from "@doras/core";
import { log, infoLog, getGlobal, noop } from "@doras/shared";
import { verifyBrowserConfig } from "./config";
import { BrowserConfig, UserConfig } from "./types";
import { BrowserTransport } from "./transport";
import { genUid } from "./user";
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
    if (global.__dora__?.client) {
      log("init has been called.");
      return global.__dora__?.client;
    }

    // log
    global.__dora__ = {
      logger: config.debug ? infoLog : noop
    };

    const defaultConfig: BrowserConfig = {
      appEnv: "",
      appId: "",
      appVersion: "",
      serverUrl: "",
      isSpa: true,
      debug: false,
      uid: genUid(),
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

    // merger config
    const { config: conf, pass } = verifyBrowserConfig(defaultConfig, config);
    if (!pass) return;

    // new Client
    const c = new Client(conf);
    global.__dora__.client = c;

    log("sdk ready!");

    return c;
  },
  setUser: (userId: string, userInfo?: { [key: string]: any }) => {
    if (!global.__dora__?.client) {
      log("please call init first.");
      return;
    }
    global.__dora__?.client.setUser(userId, userInfo);
  },
  stat: (data: StatField) => {
    if (!global.__dora__?.client) {
      log("please call init first.");
      return;
    }
    return global.__dora__?.client.statistic(data);
  }
};

export default Browser;
export * from "./plugins";
