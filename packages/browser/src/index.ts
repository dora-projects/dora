import { logger, Client, InitConfig, StatArgs, BaseClient } from "@doras/core";

export * from "./plugins/error";
export * from "./plugins/performance";

type BrowserInitConfig = InitConfig & {};

const Browser = {
  logger,
  _client: null as Client,
  init: (config: BrowserInitConfig) => {
    if (Browser._client) {
      Browser.logger().warn("init has been called.");
      return Browser._client;
    }

    Browser._client = new Client(config);
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

export default BrowserStater;
