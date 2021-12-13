import { Config } from "@doras/types";

export type BrowserConfig = Config & {};

const defaultConf: BrowserConfig = {
  serverUrl: "",
  appKey: "",
  appEnv: "",
  appVersion: "",
  debug: false,
  useDefaultPlugins: true,
  sampleRate: 1,
  maxBreadcrumbs: 15,
  user: null
};

export const verifyConfig = (
  conf: BrowserConfig
): { conf: BrowserConfig; pass: boolean } => {
  const config = Object.assign(defaultConf, conf);

  // todo 校验

  return {
    conf: config,
    pass: true
  };
};
