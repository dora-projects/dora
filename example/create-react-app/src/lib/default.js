import { getConfig } from "./store";

const u = new URLSearchParams(window.location.search);

const defaultConfig = {
  serverUrl: u.get("serverUrl") || "http://127.0.0.1:8000/collect",
  appKey: u.get("appKey") || "44992867-5a85-4804-849a-d525be1fa77c",
  appVersion: "1.0.0",
  appEnv: "test",
  debug: false
};

export default { ...defaultConfig, ...getConfig() };
