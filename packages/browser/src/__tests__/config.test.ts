import { verifyBrowserConfig } from "../config";
import { BrowserConfig } from "../types";

const defaultConfig: BrowserConfig = {
  appEnv: "",
  appId: "",
  appVersion: "",
  serverUrl: "",
  pref: {
    enable: true,
    xhrTiming: true,
    scriptTiming: true
  },
  debug: false,
  uid: "",
  transfer: null
};

describe("config", function () {
  it("verifyBrowserConfig", () => {
    const conf = verifyBrowserConfig(defaultConfig, {
      appEnv: "dev",
      appId: "vxfajhdadddcx",
      appVersion: "0.1.1",
      serverUrl: "https://api.demo.cn"
    });

    expect(conf).toEqual({
      config: {
        serverUrl: "https://api.demo.cn",
        appId: "vxfajhdadddcx",
        appEnv: "dev",
        appVersion: "0.1.1",
        debug: false,
        user: undefined,
        pref: {
          enable: true,
          scriptTiming: true,
          xhrTiming: true
        },
        transfer: null,
        uid: ""
      },
      pass: true
    });
  });
});
