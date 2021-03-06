export const t = {};

export interface Data {
  [key: string]: any;
}

export interface ClientConfig {
  serverUrl: string;

  appKey: string;
  appEnv: string;
  appVersion: string;

  debug?: boolean;
  useDefaultPlugins?: boolean;
  sampleRate?: number;
  maxBreadcrumbs?: number;
  user?: UserInfo;
  // transfer?: any;
  beforeBreadcrumb?: beforeBreadcrumbHook;
  beforeSend?: beforeSendHook;
}

export interface DataItem {
  timestamp: number;
  event_id: string;
  content: ReportArgs;
  request: EventRequest;
  breadcrumbs?: BreadcrumbItem[];
}

export interface TransportOptions {
  url: string;
  beforeSend: beforeSendHook;
}

export type beforeBreadcrumbHook = (b: BreadcrumbItem) => BreadcrumbItem;
export type beforeSendHook = (e: BatchEvent) => BatchEvent;

export interface BatchEvent {
  context: ClientContext;
  values: DataItem[];
}

export interface EventLike {
  type: "api" | "error" | "res" | "visit" | "perf" | "stat";

  [key: string]: any;
}

export interface AppField {
  appKey: string;
  appVersion: string;
  sampleRate: number;
}

export interface PageField {
  title: string;
  href: string;
}

export interface DeviceField {
  screen: string;
  viewport: string;
  ua: string;
}

export interface UserField {
  userId: string;
  userInfo: string;
}

// 性能
export interface PerfField {
  perfGroupName: "navigation_timing" | "data_consumption" | "agg_metric";
}

// 网络
export interface ApiField {
  reason: string;
  url: string;
  method: string;
  status: string;
  timeout: number;
  request: string;
  response: string;
}

// 错误
export interface ErrorField {
  errorType: string;
  errorMsg: string;
  errorStack: string;
}

// 打点
export interface StatField {
  statCategory: string;
  statAction: string;
  statLabel: string;
  statValue: any;
}

export interface SimpleStat {
  category: string;
  action: string;
  label: string;
  value: any;
}

// pv uv 统计
export type PageEvent = EventLike & PageField & DeviceField & UserField;

// error
export interface ErrorLike {
  message?: string;
  stack?: string;
}

// Api 错误
export type ApiEvent = EventLike &
  PageField &
  DeviceField &
  UserField &
  ApiField;

// 代码错误
export type ErrorEvent = EventLike &
  PageField &
  DeviceField &
  UserField &
  ErrorField;

// 性能
export type PerfEvent = EventLike & PageField & DeviceField & PerfField;

// 打点
export type StatEvent = EventLike & PageField & StatField & UserField;

export interface UserInfo {
  [key: string]: any;
}

export interface ClientContext {
  appKey: string;
  release: string;
  environment: string;
  anonymousId: string;
  sessionId: string;
  sdk: {
    name: string;
    version: string;
  };
  user?: UserInfo;
}

export interface BreadcrumbApi {
  add(b: BreadcrumbItem): void;

  getItems(): BreadcrumbItem[];
}

export interface BreadcrumbOpts {
  maxBreadcrumbs: number;
  beforeBreadcrumb: beforeBreadcrumbHook;
}

export interface BreadcrumbItem {
  category: string;
  message: string;
  data?: string;
  type?: string;
  timestamp?: number;
}

export interface EventRequest {
  referer: string;
  ua: string;
  url: string;
}

export interface ReportArgs {
  type: string;
  subtype?: string;

  [key: string]: any;
}

export interface StatArgs {
  category: string;
  label: string;
  stringValue?: string;
  numberValue?: string;
}

export interface IssueArgs {
  message: string;
  detail?: string;
  contact?: string;
}

export type PluginReport = (e: ReportArgs) => void;

export type PluginRegisterFunc = (args: {
  report: PluginReport;
  clientConfig: ClientConfig;
  breadcrumb: BreadcrumbApi;
}) => void;

export interface Schema {
  [key: string]: {
    message: string;
    validate: (v) => boolean;
  };
}
