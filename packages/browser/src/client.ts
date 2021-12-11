import { Client, Plugin, Store, Transport } from "@doras/core";
import {
  BatchEvent,
  ClientContext,
  DataItem,
  PluginRegisterFunc,
  ReportArgs
} from "@doras/types";
import { BrowserConfig } from "./config";
import { BrowserStore } from "./store";
import * as plugins from "./plugins";
import { BrowserTransport } from "./transport";
import { urlIgnoreQuery, uuid } from "@doras/shared";

const pkgName = "__PkgName";
const pkgVersion = "__PkgVersion";

export class BrowserClient extends Client {
  private readonly config: BrowserConfig = null;
  private active: boolean = false;
  private store: Store;
  private readonly context: ClientContext = null;
  private pluginNames: string[];
  private pluginsRegisters: PluginRegisterFunc[];
  private pluginsUnRegisters: (() => void)[];
  private errors: string[];
  private transfer: Transport;

  constructor(config: BrowserConfig) {
    super();
    // todo verify config
    this.config = config;

    this.pluginNames = [];
    this.pluginsRegisters = [];
    this.pluginsUnRegisters = [];
    this.errors = [];

    this.transfer = new BrowserTransport({
      url: this.config.serverUrl,
      beforeSend: this.config.beforeSend
    });

    this.store = new BrowserStore();

    const uid = this.store.getAnonymousId();
    const sid = this.store.getSessionId();

    this.context = {
      appKey: this.config.appKey,
      release: this.config.appVersion,
      environment: this.config.appEnv,
      sessionId: sid,
      anonymousId: uid,
      user: null,
      sdk: {
        name: pkgName,
        version: pkgVersion
      }
    };
  }

  use(plugins: Plugin | Plugin[]): void {
    if (Array.isArray(plugins)) {
      plugins.forEach((p) => this._usePlugin(p));
    } else {
      this._usePlugin(plugins);
    }
  }

  private _usePlugin(p: Plugin) {
    const { name, register, unregister } = p;
    if (this.pluginNames.indexOf(name) > -1) {
      console.log(`${name} plugin has been used!`);
      return;
    }
    this.pluginNames.push(name);
    this.pluginsRegisters.push(register);
    this.pluginsUnRegisters.push(unregister);
  }

  isActive(): boolean {
    return this.active;
  }

  start(): void {
    if (this.active) {
      console.log("dora has started!");
      return;
    }

    if (this.pluginsRegisters.length <= 0) {
      const defaultPlugins = [
        plugins.ErrorPlugin(),
        plugins.PerfumePlugin(),
        plugins.ResourcePlugin(),
        plugins.XhrPlugin(),
        plugins.VisitPlugin()
      ];
      this.use(defaultPlugins);
    }

    this._installPlugin();
    this.active = true;
    console.log(`${pkgName} start... (version: v${pkgVersion})`);
  }

  stop(): void {
    this._uninstallPlugin();
    this.active = false;
  }

  private _installPlugin() {
    this.pluginsRegisters.map((item) => {
      item({ report: this.notify.bind(this), clientConfig: this.config });
    });
  }

  private _uninstallPlugin() {
    this.pluginsUnRegisters.map((item) => {
      item();
    });
  }

  private notify(e: ReportArgs) {
    // dora ignore same error
    if (e.agg) {
      if (this.errors.indexOf(e.agg) > -1) return;
      this.errors.push(e.agg);
      delete e.agg;
    }

    const event = {
      content: e,
      timestamp: Date.now(),
      event_id: uuid(),
      request: {
        referer: urlIgnoreQuery(window.document.referrer),
        url: urlIgnoreQuery(window.location.href),
        ua: window.navigator?.userAgent
      }
    };

    this.sendToServer(event);

    // todo 延迟 批量发送
    // if (event.content.type === constant.ERROR) {
    // } else {
    //   this.store.save(event);
    // }
  }

  private sendToServer(d: DataItem | DataItem[]) {
    const val = Array.isArray(d) ? d : [d];
    const ctx = this.context;
    const sendData: BatchEvent = {
      context: ctx,
      values: val
    };
    this.transfer.send(sendData).then((res) => {
      console.log(res);
    });
  }

  setUser(user): void {
    this.context.user.userId = user?.userId;
    console.log(this.context.sessionId);
  }

  issue(): void {}

  catchError(): void {}
}
