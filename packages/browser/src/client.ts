import { Client, constant, Plugin, Store, Transport } from "@doras/core";
import {
  BatchEvent,
  ClientContext,
  DataItem,
  PluginRegisterFunc,
  ReportArgs
} from "@doras/types";
import {
  computeStackTrace,
  createSummary,
  exceptionFromCustomCatchPrimitive,
  exceptionFromStacktrace,
  isError,
  isPrimitive,
  Level,
  logger,
  urlIgnoreQuery,
  uuid
} from "@doras/shared";
import {
  BrowserOptions,
  verifyCatchError,
  verifyIssue,
  verifyOptions,
  verifySetUser,
  verifyStat
} from "./config";
import { BrowserStore } from "./store";
import * as plugins from "./plugins";
import { BrowserTransport } from "./transport";
import { Breadcrumb } from "@doras/core";

const pkgName = "__PkgName";
const pkgVersion = "__PkgVersion";

const defaultPlugins = [
  plugins.ErrorPlugin(),
  plugins.PerfumePlugin(),
  plugins.ResourcePlugin(),
  plugins.XhrPlugin(),
  plugins.VisitPlugin()
];

export class BrowserClient extends Client {
  private readonly config: BrowserOptions = null;
  private active: boolean = false;
  private store: Store;
  private readonly context: ClientContext = null;
  private pluginNames: string[];
  private pluginsRegisters: PluginRegisterFunc[];
  private pluginsUnRegisters: (() => void)[];
  private readonly breadcrumb: Breadcrumb;
  private errors: string[];
  private transfer: Transport;

  constructor(options: BrowserOptions) {
    super();

    const { conf, pass } = verifyOptions(options);
    if (!pass) return;
    this.config = conf;

    if (this.config.debug) {
      logger.setLevel(Level.DEBUG);
    }

    this.pluginNames = [];
    this.pluginsRegisters = [];
    this.pluginsUnRegisters = [];
    this.breadcrumb = new Breadcrumb({
      maxBreadcrumbs: this.config.maxBreadcrumbs,
      beforeBreadcrumb: this.config.beforeBreadcrumb
    });
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
      logger.warn(`${name} plugin has been used!`);
      return;
    }
    this.pluginNames.push(name);
    this.pluginsRegisters.push(register);
    this.pluginsUnRegisters.push(unregister);
  }

  isActive(): boolean {
    return this.active;
  }

  isReady(): boolean {
    return !!this.config;
  }

  start(): void {
    if (this.isActive()) {
      logger.debug("dora has started!");
      return;
    }

    if (!this.isReady()) {
      logger.debug("please check config!");
      return;
    }

    if (this.config.useDefaultPlugins) {
      this.use(defaultPlugins);
    }

    this._installPlugin();
    this.active = true;
    logger.debug(`${pkgName} start... (version: v${pkgVersion})`);
  }

  stop(): void {
    this._uninstallPlugin();
    this.active = false;
  }

  private _installPlugin() {
    this.pluginsRegisters.map((item) => {
      item({
        report: this.notify.bind(this),
        breadcrumb: this.breadcrumb,
        clientConfig: this.config
      });
    });
  }

  private _uninstallPlugin() {
    this.pluginsUnRegisters.map((item) => {
      item();
    });
  }

  private notify(e: ReportArgs) {
    if (!this.isActive()) {
      logger.debug("need run dora.start()");
      return;
    }

    // dora ignore same error
    if (e.agg) {
      if (this.errors.indexOf(e.agg) > -1) return;
      this.errors.push(e.agg);
      delete e.agg;
    }

    const event: DataItem = {
      content: e,
      timestamp: Date.now(),
      event_id: uuid(),
      request: {
        referer: urlIgnoreQuery(window.document.referrer),
        url: urlIgnoreQuery(window.location.href),
        ua: window.navigator?.userAgent
      }
    };

    if (e.type === constant.ERROR) {
      event.breadcrumbs = this.breadcrumb.getItems();
    }

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
    this.transfer.send(sendData).then((res) => {});
  }

  setUser(user): void {
    const { pass } = verifySetUser(user);
    if (!pass) return;

    this.context.user = user;
  }

  stat(args): void {
    const { pass } = verifyStat(args);
    if (!pass) return;

    const { category, label, stringValue, numberValue } = args;
    this.notify({
      type: constant.STAT,
      subtype: constant.STAT_KV,
      stat: {
        category,
        label,
        stringValue,
        numberValue: Number(numberValue)
      }
    });
  }

  issue(args): void {
    const { pass } = verifyIssue(args);
    if (!pass) return;

    const { title, content, contact } = args;
    this.notify({
      type: constant.ERROR,
      subtype: constant.ERROR_ISSUE,
      error: {
        issue: { title, content, contact }
      }
    });
  }

  catchError(e): void {
    const { pass } = verifyCatchError(e);
    if (!pass) return;

    let ex = null;
    if (isPrimitive(e)) {
      ex = exceptionFromCustomCatchPrimitive(e);
    } else if (isError(e)) {
      const stacktrace = computeStackTrace(e);
      ex = exceptionFromStacktrace(stacktrace);
    }
    if (!ex) return;

    const agg = { message: e?.message, stack: e?.stack };

    this.notify({
      type: constant.ERROR,
      category: constant.ERROR_CUSTOM_CATCH,
      error: {
        values: ex.values
      },
      agg: createSummary(JSON.stringify(agg), 300)
    });
  }
}
