import { verifyConfig, BaseSchema } from "@doras/core";
import { isEmptyObject, error, debug } from "@doras/shared";
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
    error("verify config error：", result.errors);
  }

  debug("final config:", result.config);
  return { config: result.config, pass };
};
