import {
  isString,
  isBoolean,
  isNumber,
  isObject,
  verifyConfig,
  BaseSchema
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
  console.log(JSON.stringify(result, null, 2));
  return result.config;
};
