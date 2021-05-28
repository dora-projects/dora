import { logger, Client, InitConfig } from "@doras/core";

export * from "./plugins/error";
export * from "./plugins/performance";

type BrowserInitConfig = InitConfig & {};

const BrowserStater = {
  logger,
  _client: null,
  init: (config: BrowserInitConfig) => {
    if (BrowserStater._client) {
      BrowserStater.logger().warn("init has been called.");
      return BrowserStater._client;
    }

    BrowserStater._client = new Client(config);
    return BrowserStater._client;
  }
};

export default BrowserStater;
