import { Browser } from "@doras/browser";
import { getConfig } from "../config";

export const defaultConfig = {
  serverUrl: "http://127.0.0.1:8221/collect",
  appId: "44992867-5a85-4804-849a-d525be1fa77c",
  appVersion: "0.0.1",
  appEnv: "dev",
  debug: false
};

Browser.init(Object.assign(defaultConfig, getConfig()));
