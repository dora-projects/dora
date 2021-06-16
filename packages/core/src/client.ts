import { logger } from "./logger";
import { BaseConfig, StatField, BaseClient, userData } from "./types";
import {
  executorSetups,
  executorBeforeSend,
  executorSendAfter
} from "./helper";

export class Client implements BaseClient {
  private appId: string;
  private appName: string;
  private appVersion: string;
  private sampleRate: number;
  private user: userData;
  private transfer: (data) => Promise<any>;
  private pluginHooks: {
    onEventBeforeSend: any[];
    onEventSendAfter: any[];
  };

  constructor(conf: BaseConfig) {
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
        const { name, setup, onEventBeforeSend, onEventAfterSend } = plugin;

        logger().debug(`${name} has install`);

        //name
        name && acc.pluginNames.push(name);

        // setup
        if (setup) {
          setup.pluginName = name;
          acc.pluginSetups.push(setup);
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
        pluginSetups: [],
        pluginHooks: {
          onEventBeforeSend: [],
          onEventAfterSend: []
        }
      }
    );

    // hook
    this.pluginHooks = result.pluginHooks;

    // 执行 setups
    executorSetups(result.pluginSetups, client);
  }

  statistic(data: StatField) {
    console.log(data);
  }

  async report(pluginName, originEvent) {
    logger().debug(`received ${pluginName} report data: `, originEvent);

    // hook onEventBeforeSend
    const event = await executorBeforeSend(
      this.pluginHooks.onEventBeforeSend,
      originEvent
    );

    // transfer to server
    const res = await this.transfer(event);

    // hook onEventSendAfter
    await executorSendAfter(this.pluginHooks.onEventSendAfter, event, res);
  }

  setUser(uid: string, data?: { [key: string]: any }) {
    this.user.uid = uid;
    if (data) {
      this.user.data = data;
    }
  }

  getUser(): userData {
    return this.user;
  }
}
