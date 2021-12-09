export const t = {};

export interface Data {
  [key: string]: any;
}

export interface BaseConfig {
  serverUrl: string;

  appKey: string;
  appEnv: string;
  appVersion: string;

  notify: (url: string, data: Data) => Promise<any>;

  debug?: boolean;
  sampleRate?: number;
  maxBreadcrumbs?: number;
  user?: UserInfo;
  beforeSend?: (e: EventLike) => EventLike;
}

export interface EventLike {
  type: "api"|"error"|"res"|"visit"|"perf"|"stat";

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
  perfGroupName: "navigation_timing"|"data_consumption"|"agg_metric";
}

// 网络
export interface ApiField {
  type: "server_error"|"timeout"|"error";
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
export type PageEvent = EventLike&PageField&DeviceField&UserField;

// error
export interface ErrorLike {
  message?: string;
  stack?: string;
}

// Api 错误
export type ApiEvent = EventLike&
  PageField&
  DeviceField&
  UserField&
  ApiField;

// 代码错误
export type ErrorEvent = EventLike&
  PageField&
  DeviceField&
  UserField&
  ErrorField;

// 性能
export type PerfEvent = EventLike&PageField&DeviceField&PerfField;

// 打点
export type StatEvent = EventLike&PageField&StatField&UserField;

export interface UserInfo {
  userId: string|number|null;
  anonymousId: string|null;

  [key: string]: any;
}
