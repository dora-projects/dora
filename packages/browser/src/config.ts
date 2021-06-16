import { verifyConfig, BaseSchema, logger } from "@doras/core";
import {
  isString,
  isBoolean,
  isNumber,
  isObject,
  isEmptyObject
} from "@doras/shared";
import { BrowserConfig } from "./types";
import { BrowserTransport } from "./transport";
import {
  ApiPlugin,
  DevicePlugin,
  ErrorPlugin,
  VisitPlugin,
  PerfumePlugin
} from "./plugins";

export const BrowserSchema = {};

export const defaultConfig: BrowserConfig = {
  appEnv: "",
  appId: "",
  appVersion: "",
  serverUrl: "",
  userStore: () => {
    return {
      uid: "",
      data: {}
    };
  },
  transfer: BrowserTransport,
  plugins: [
    DevicePlugin(),
    VisitPlugin(),
    ApiPlugin(),
    ErrorPlugin(),
    PerfumePlugin()
  ]
};

export const verifyBrowserConfig = (
  config
): { config: BrowserConfig; pass: boolean } => {
  const mergedConf = Object.assign(defaultConfig, config);
  const mergedSchema = Object.assign(BaseSchema, BrowserSchema);

  const result = verifyConfig<BrowserConfig>(mergedConf, mergedSchema);

  let pass = true;
  if (!isEmptyObject(result.errors)) {
    pass = false;
    logger().warn("配置错误：", JSON.stringify(result, null, 2));
  }

  return { config: result.config, pass };
};
