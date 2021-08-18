import { Client, SimpleStat, BaseClient, ErrorLike } from "@doras/core";
import { getGlobal, errorFormat, logger } from "@doras/shared";
import { verifyBrowserConfig } from "./config";
import { BrowserConfig, Error, Error_CustomCatch } from "./types";
import { BrowserTransport } from "./transport";
import { genUid } from "./user";
import {
  XhrPlugin,
  DevicePlugin,
  ErrorPlugin,
  PerfumePlugin,
  ResourcePlugin,
  VisitPlugin
} from "./plugins";

const g = getGlobal();
const version = "__buildVersion";
const bTime = "__buildTime";

export const Browser = {
  _getClient: (): BaseClient => {
    if (!g.__DORA__?.client) {
      logger.error("please call init first.");
      return;
    }
    return g.__DORA__?.client;
  },
  init: (userConfig: BrowserConfig) => {
    if (g.__DORA__?.client) {
      logger.warn("init has been called.");
      return g.__DORA__?.client;
    }

    if (!userConfig.debug) {
      logger.disable();
    }

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
      XhrPlugin(),
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
    g.__DORA__.client = c;

    logger.debug(`sdk v${version} build at ${bTime}`);
    return c;
  },
  setUser: (userId: string, userInfo?: { [key: string]: any }) => {
    Browser._getClient()?.setUser(userId, userInfo);
  },
  catchException: (msg: string, e: ErrorLike) => {
    const detail = errorFormat(e);

    Browser._getClient()
      ?.report("customReport", {
        type: Error,
        subType: Error_CustomCatch,
        error: { msg, ...detail }
      })
      .then((r) => {});
  },
  stat: (data: SimpleStat) => {
    const { category, action, label, value } = data;
    Browser._getClient()?.statistic({
      statCategory: category,
      statAction: action,
      statLabel: label,
      statValue: value
    });
  }
};

export * from "./plugins";
