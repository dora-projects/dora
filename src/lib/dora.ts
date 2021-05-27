import { executorInit, executorBeforeSend, logger } from "./helper";

export * from "./plugin";

class Dora {
  pluginHooks: {
    onEventBeforeSend: any[]
    onEventSendAfter: any[],
  };

  constructor(conf) {
    this.pluginHooks = {
      onEventBeforeSend: [],
      onEventSendAfter: [],
    };

    if (conf.plugins) {
      this.use(conf.plugins);
    }
  }

  use(plugins) {
    const client = this;
    const result = plugins.reduce((acc, plugin) => {
      const {
        name,
        init,
        onEventBeforeSend,
        onEventAfterSend,
      } = plugin;

      logger.info(`${name} has install`);

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
    }, {
      pluginNames: [],
      pluginInits: [],
      pluginHooks: {
        onEventBeforeSend: [],
        onEventAfterSend: [],
      },
    });

    // hook
    this.pluginHooks = result.pluginHooks;

    // 执行 init
    executorInit(result.pluginInits, client);
  }

  async report(pluginName, originEvent) {
    logger.log(`received ${pluginName} report data: `, originEvent);

    const event =await executorBeforeSend(this.pluginHooks.onEventBeforeSend, originEvent);
    debugger
    console.log(event)
  }

}


export default {
  init: (conf) => {
    return new Dora(conf);
  },
};
