import { logger, Client, StatArgs } from "@doras/core";
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

    const conf = verifyBrowserConfig(config);
    Browser._client = new Client(conf);

    return Browser._client;
  },
  stat: (data: StatArgs) => {
    if (!Browser._client) {
      Browser.logger().warn("please call init first.");
      return Browser._client;
    }
    return Browser._client.statistic(data);
  }
};

export default Browser;

export * from "./plugins/error";
export * from "./plugins/performance";
