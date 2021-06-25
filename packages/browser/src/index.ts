import { Client, StatField, BaseClient, ErrorLike } from "@doras/core";
import { log, infoLog, getGlobal, isPrimitive, noop } from "@doras/shared";
import { verifyBrowserConfig } from "./config";
import { BrowserConfig, Error, Error_CustomCatch } from "./types";
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
const version = "__buildVersion";

const Browser = {
  _getClient: (): BaseClient => {
    if (!global.__dora__?.client) {
      log("please call init first.");
      return;
    }
    return global.__dora__?.client;
  },
  init: (userConfig: BrowserConfig) => {
    if (global.__dora__?.client) {
      log("init has been called.");
      return global.__dora__?.client;
    }

    // log
    global.__dora__ = {
      logger: userConfig.debug ? infoLog : noop
    };

    const defaultConfig: BrowserConfig = {
      appEnv: "",
      appId: "",
      appVersion: "",
      serverUrl: "",
      pref: {
        enable: true,
        xhrTiming: true,
        scriptTiming: true
      },
      debug: false,
      uid: genUid(),
      transfer: BrowserTransport
    };

    // merger config
    const { config: conf, pass } = verifyBrowserConfig(
      defaultConfig,
      userConfig
    );
    if (!pass) return;

    // plugins
    const plugins = [
      ApiPlugin(),
      DevicePlugin(),
      ErrorPlugin(),
      PerfumePlugin({
        enable: conf.pref.enable,
        scriptTiming: conf.pref.scriptTiming,
        xhrTiming: conf.pref.xhrTiming
      }),
      ResourcePlugin(),
      VisitPlugin()
    ];

    // new Client
    const c = new Client(conf, plugins);
    global.__dora__.client = c;

    console.log(`%c Dora sdk v${version}`, `font-size:16px; color:green;`);

    return c;
  },
  setUser: (userId: string, userInfo?: { [key: string]: any }) => {
    Browser._getClient().setUser(userId, userInfo);
  },
  catchException: (msg: string, e: ErrorLike) => {
    const detail = {
      msg: msg,
      error: null,
      stack: null
    };

    if (!isPrimitive(e)) {
      try {
        detail.error = e.message;
        detail.stack = e.stack;
      } catch (_) {}
    } else {
      detail.error = e || null;
    }

    Browser._getClient()
      .report("customReport", {
        type: Error,
        subType: Error_CustomCatch,
        error: detail
      })
      .then((r) => {});
  },
  stat: (data: StatField) => {
    Browser._getClient().statistic(data);
  }
};

export default Browser;
export * from "./plugins";
