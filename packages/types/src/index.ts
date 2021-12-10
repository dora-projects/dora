export const t = {};

export interface Data {
  [key: string]: any;
}

export interface Config {
  serverUrl: string;

  appKey: string;
  appEnv: string;
  appVersion: string;

  debug?: boolean;
  sampleRate?: number;
  maxBreadcrumbs?: number;
  user?: UserInfo;
  notify?: (url: string, data: Data) => Promise<any>;
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
  userName: string|null;

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

export interface Breadcrumb {
  id: string;
  category: string;
  data: any;
  message: string;
  timestamp: string;
  type: string;
}

export interface StacktraceFrames {
  colno: number,
  lineno: number,
  filename: string,
  function: string,
}

export interface EventRequest {
  referer: string,
  ua: string,
  url: string,
}
