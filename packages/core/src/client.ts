import { createUUID, logger } from "@doras/shared";
import {
  executorSetups,
  executorBeforeSend,
  executorSendAfter
} from "./executor";
import {
  BaseConfig,
  EventLike,
  BaseClient,
  userData,
  Transport,
  Plugin
} from "./types";

const version = "__buildVersion";

export class Client implements BaseClient {
  readonly conf: BaseConfig;

  private readonly user: userData;
  private readonly transfer: Transport;
  private pluginHooks: {
    onEventBeforeSend: any[];
    onEventSendAfter: any[];
  };

  private events: EventLike[];

  constructor(conf: BaseConfig, plugins: Plugin[]) {
    this.conf = conf;
    this.transfer = conf.transfer;
    this.user = {
      uid: conf.uid,
      // business user id
      bizUid: null,
      bizUser: null
    };
    this.events = [];

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

  async report(pluginName, originEvent: EventLike) {
    try {
      const originEventExtra = this.addExtraInfo(originEvent);
      const event = await executorBeforeSend(
        this.pluginHooks.onEventBeforeSend,
        originEventExtra
      );

      const { type } = event;
      if (!type) {
        logger.debug("missing type!", event);
        return;
      }

      this.events.push(event);
      await this.commit();

      await executorSendAfter(this.pluginHooks.onEventSendAfter, event);
    } catch (e) {
      logger.error(e);
    }
  }

  async commit() {
    try {
      await this.transfer(this.conf.serverUrl, this.events);
      this.events = [];
    } catch (e) {
      if (e?.message?.indexOf("cancel") <= -1) logger.error(e);
    }
  }

  addExtraInfo(event: EventLike): EventLike {
    event.appId = this.conf.appId;
    event.env = this.conf.appEnv;
    event.version = this.conf.appVersion;
    event.sdk = version;

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
