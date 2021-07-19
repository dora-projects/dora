import { Browser } from "@doras/browser";

function getConfig() {
  return localStorage.getItem("dora-example-config");
}

const {
  serverUrl = "http://127.0.0.1:8221/collect",
  appId = "44992867-5a85-4804-849a-d525be1fa77c",
  appVersion = "0.0.1",
  appEnv = "dev",
  debug = "false"
} = getConfig() || {};

Browser.init({
  appEnv,
  serverUrl,
  appId,
  appVersion,
  debug
});
