import { logger } from "./logger";
import {
  executorSetups,
  executorBeforeSend,
  executorSendAfter
} from "./executor";
import {
  BaseConfig,
  EventLike,
  StatField,
  BaseClient,
  userData
} from "./types";

export class Client implements BaseClient {
  private serverUrl: string;

  private appId: string;
  private appVersion: string;
  private appEnv: string;

  private sampleRate: number;

  private user: userData;
  private transfer: (data) => Promise<any>;
  private pluginHooks: {
    onEventBeforeSend: any[];
    onEventSendAfter: any[];
  };

  constructor(conf: BaseConfig) {
    this.serverUrl = conf.serverUrl;

    this.appId = conf.appId;
    this.appVersion = conf.appVersion;
    this.appEnv = conf.appEnv;

    this.sampleRate = conf.sampleRate;

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
    executorSetups(result.pluginSetups, client, { serverUrl: this.serverUrl });
  }

  statistic(data: StatField) {
    this.report("stat", { type: "stat", ...data }).then(() => {});
  }

  async report(pluginName, originEvent: EventLike) {
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
