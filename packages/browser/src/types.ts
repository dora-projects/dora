import { logger, Client, BaseConfig } from "@doras/core";

export type BrowserConfig = BaseConfig & {
  isSpa: boolean;
};

export type UserConfig = BrowserConfig;
