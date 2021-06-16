import { logger, Client, StatField } from "@doras/core";
import { verifyBrowserConfig } from "./config";
import { BrowserConfig } from "./types";

const Browser = {
  logger,
  _client: null as Client,
  init: (config: BrowserConfig) => {
    if (Browser._client) {
      Browser.logger().warn("init has been called.");
      return Browser._client;
    }

    const { config: conf, pass } = verifyBrowserConfig(config);
    if (!pass) return;

    Browser._client = new Client(conf);

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
