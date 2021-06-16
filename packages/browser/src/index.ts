import { logger, Client, StatField } from "@doras/core";
import { verifyBrowserConfig } from "./config";
import { BrowserConfig, UserConfig } from "./types";
import { BrowserTransport } from "./transport";
import {
  ApiPlugin,
  DevicePlugin,
  ErrorPlugin,
  PerfumePlugin,
  VisitPlugin
} from "./plugins";

const Browser = {
  logger,
  _client: null as Client,
  init: (config: UserConfig) => {
    if (Browser._client) {
      Browser.logger().warn("init has been called.");
      return Browser._client;
    }

    const defaultConfig: BrowserConfig = {
      appEnv: "",
      appId: "",
      appVersion: "",
      serverUrl: "",
      isSpa: true,
      debug: false,
      transfer: BrowserTransport,
      plugins: [
        DevicePlugin(),
        VisitPlugin(),
        ApiPlugin(),
        ErrorPlugin(),
        PerfumePlugin()
      ]
    };

    const { config: conf, pass } = verifyBrowserConfig(defaultConfig, config);
    if (!pass) return;

    Browser._client = new Client(conf);
    Browser.logger().info("sdk ready!");

    return Browser._client;
  },
  stat: (data: StatField) => {
    if (!Browser._client) {
      Browser.logger().warn("please call init first.");
      return Browser._client;
    }
    return Browser._client.statistic(data);
  }
};

export default Browser;

export * from "./plugins/error";
export * from "./plugins/perfume";
