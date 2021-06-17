import { verifyConfig, BaseSchema } from "@doras/core";
import { log, isEmptyObject } from "@doras/shared";
import { BrowserConfig } from "./types";

export const BrowserSchema = {};

export const verifyBrowserConfig = (
  defaultConfig: BrowserConfig,
  userConfig: BrowserConfig
): { config: BrowserConfig; pass: boolean } => {
  const mergedConf = Object.assign(defaultConfig, userConfig);
  const mergedSchema = Object.assign(BaseSchema, BrowserSchema);

  const result = verifyConfig<BrowserConfig>(mergedConf, mergedSchema);

  let pass = true;
  if (!isEmptyObject(result.errors)) {
    pass = false;
    log("配置错误：", JSON.stringify(result, null, 2));
  }

  return { config: result.config, pass };
};
