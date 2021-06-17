import { timeout, noop } from "@doras/shared";
import {
  executorSetups,
  executorBeforeSend,
  executorSendAfter
} from "./executor";
import { log } from "@doras/shared";
import {
  BaseConfig,
  EventLike,
  StatField,
  BaseClient,
  userData,
  Transport
} from "./types";

export class Client implements BaseClient {
  readonly conf: BaseConfig;

  private user: userData;
  private readonly transfer: Transport;
  private pluginHooks: {
    onEventBeforeSend: any[];
    onEventSendAfter: any[];
  };

  private eventQueue: EventLike[];
  private delay: {
    start: () => Promise<any>;
    timer: any;
    cancel: (err?) => void;
  };

  constructor(conf: BaseConfig) {
    this.conf = conf;
    this.transfer = conf.transfer;

    this.eventQueue = [];

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
    executorSetups(result.pluginSetups, client, this.conf);
  }

  statistic(data: StatField) {
    this.report("stat", { type: "stat", ...data }).then(() => {});
  }

  async report(pluginName, originEvent: EventLike) {
    try {
      log(`received ${pluginName} report data: `, originEvent);

      // hook onEventBeforeSend
      const event = await executorBeforeSend(
        this.pluginHooks.onEventBeforeSend,
        originEvent
      );

      // 放入 eventQueue
      this.eventQueue.push(event);

      // transfer to server
      await this.batchTransfer();

      // hook onEventSendAfter
      await executorSendAfter(this.pluginHooks.onEventSendAfter, event);
    } catch (e) {
      console.log(e);
    }
  }

  async batchTransfer() {
    try {
      if (this.delay?.timer) {
        this.delay?.cancel();
      }

      // 600 毫秒内只发送一次
      this.delay = timeout(600);
      await this.delay?.start();

      await this.transfer("sendBeacon", this.conf.serverUrl, this.eventQueue);

      // 置空
      this.eventQueue = [];
    } catch (e) {}
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
