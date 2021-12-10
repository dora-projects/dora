import { ClientContext } from "@doras/types";
import { Client, Plugin, PluginRegisterFunc, Store } from "@doras/core";
import { BrowserConfig } from "./config";
import { BrowserStore } from "./store";
import * as plugins from "./plugins";

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

  constructor(config: BrowserConfig) {
    super();
    // config
    this.config = config;

    this.pluginNames = [];
    this.pluginsRegisters = [];
    this.pluginsUnRegisters = [];

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

  // todo 同类错误上报一次
  // todo 性能等数据延迟上报
  private notify(e) {
    const ctx = this.context;
    const event = { context: ctx, data: e };
    console.log("gotNotify", event.data);
    this.store.push(event);
  }

  setUser(user): void {
    this.context.user.userId = user?.userId;
    console.log(this.context.sessionId);
  }

  setMetadata(key: string, value: string): void {}

  issue(): void {}

  catchError(): void {}
}
