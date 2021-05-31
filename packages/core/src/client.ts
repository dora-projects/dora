import { logger } from "./logger";
import { InitConfig, StatArgs, BaseClient } from "./types";
import { executorBeforeSend, executorInit } from "./helper";

export class Client implements BaseClient {
  appId: string;
  appName: string;
  appVersion: string;
  sampleRate: number;

  transfer: (data) => Promise<any>;

  pluginHooks: {
    onEventBeforeSend: any[];
    onEventSendAfter: any[];
  };

  constructor(conf: InitConfig) {
    this.pluginHooks = {
      onEventBeforeSend: [],
      onEventSendAfter: []
    };

    if (conf.plugins) {
      this.use(conf.plugins);
    }
  }

  use(plugins) {
    const client = this;
    const result = plugins.reduce(
      (acc, plugin) => {
        const { name, init, onEventBeforeSend, onEventAfterSend } = plugin;

        logger().debug(`${name} has install`);

        //name
        name && acc.pluginNames.push(name);

        // init
        if (init) {
          init.pluginName = name;
          acc.pluginInits.push(init);
        }

        // hooks
        if (onEventBeforeSend) {
          onEventBeforeSend.pluginName = name;
          acc.pluginHooks.onEventBeforeSend.push(onEventBeforeSend);
        }
        if (onEventAfterSend) {
          onEventAfterSend.pluginName = name;
          acc.pluginHooks.onEventAfterSend.push(onEventAfterSend);
        }

        return acc;
      },
      {
        pluginNames: [],
        pluginInits: [],
        pluginHooks: {
          onEventBeforeSend: [],
          onEventAfterSend: []
        }
      }
    );

    // hook
    this.pluginHooks = result.pluginHooks;

    // 执行 init
    executorInit(result.pluginInits, client);
  }

  statistic(data: StatArgs) {
    console.log(data);
  }

  async report(pluginName, originEvent) {
    logger().debug(`received ${pluginName} report data: `, originEvent);

    const event = await executorBeforeSend(this.pluginHooks.onEventBeforeSend, originEvent);
    console.log(event);
  }
}
