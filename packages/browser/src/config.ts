import {
  isString,
  isBoolean,
  isNumber,
  isObject,
  isEmptyObject,
  verifyConfig,
  BaseSchema,
  logger
} from "@doras/core";
import { BrowserConfig } from "./types";
import { BrowserTransport } from "./transport";

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
  plugins: []
};

export const verifyBrowserConfig = (config): BrowserConfig => {
  const mergedConf = Object.assign(defaultConfig, config);
  const mergedSchema = Object.assign(BaseSchema, BrowserSchema);

  const result = verifyConfig<BrowserConfig>(mergedConf, mergedSchema);

  if (!isEmptyObject(result.errors)) {
    logger().warn("配置错误：", JSON.stringify(result, null, 2));
  }
  return result.config;
};
