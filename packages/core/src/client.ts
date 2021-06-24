import { timeout, createUUID } from "@doras/shared";
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
  Transport,
  Plugin
} from "./types";

export class Client implements BaseClient {
  readonly conf: BaseConfig;

  private readonly user: userData;
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

  constructor(conf: BaseConfig, plugins: Plugin[]) {
    this.conf = conf;
    this.transfer = conf.transfer;
    this.user = {
      uid: conf.uid,
      // business user id
      bizUid: null,
      bizUser: null
    };
    this.eventQueue = [];

    this.pluginHooks = {
      onEventBeforeSend: [],
      onEventSendAfter: []
    };

    if (plugins && Array.isArray(plugins)) {
      this.use(plugins);
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
      // add extra info
      const originEventExtra = this.addExtraInfo(originEvent);

      // hook onEventBeforeSend
      const event = await executorBeforeSend(
        this.pluginHooks.onEventBeforeSend,
        originEventExtra
      );

      const { type } = event;
      if (!type) {
        log("missing type!", event);
        return;
      }

      // use img report  "performance", "stat"
      if ([].includes(type)) {
        // todo
        console.log(event);
      } else {
        // put event to queue
        this.eventQueue.push(event);
        // transfer to server
        await this.batchTransfer();
      }

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

      await this.transfer(this.conf.serverUrl, this.eventQueue);

      // 置空
      this.eventQueue = [];
    } catch (e) {}
  }

  addExtraInfo(event: EventLike): EventLike {
    event.appId = this.conf.appId;
    event.appEnv = this.conf.appEnv;
    event.appVersion = this.conf.appVersion;

    event.uid = this.user.uid;

    event.buid = this.user.bizUid;
    event.buser = this.user.bizUser;

    event.ts = Date.now();
    event.eid = createUUID();

    return event;
  }

  setUser(userId: string | number, userInfo?: { [key: string]: any }) {
    this.user.bizUid = userId;
    if (userInfo) {
      this.user.bizUser = userInfo;
    }
  }

  getUser(): userData {
    return this.user;
  }
}
