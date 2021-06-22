export interface Data {
  [key: string]: any;
}

export interface BaseConfig {
  serverUrl: string;

  appId: string;
  appEnv: string;
  appVersion: string;

  uid?: string;
  debug?: boolean;
  sampleRate?: number;

  user?: userData;
  transfer?: (url: string, data: Data) => Promise<any>;
  plugins?: Plugin[];

  [key: string]: any;
}

export type Transport = (url: string, data: Data) => Promise<any>;

export interface EventLike {
  type: "api" | "error" | "resource" | "visit" | "performance" | "stat";
  subType?: string;

  [key: string]: any;
}

export interface AppField {
  appId: string;
  appName: string;
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
  apiType: "server_error" | "timeout" | "error";
  apiUrl: string;
  apiMethod: string;
  apiStatus: string;
  apiTimeout: number;
  apiRequest: string;
  apiResponse: string;
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

// pv uv 统计
export type PageEvent = EventLike & PageField & DeviceField & UserField;

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

export interface BaseClient {
  use: (plugins: Plugin[]) => void;
  statistic: (data: StatField) => void;
  report: (pluginName: string, data: any) => Promise<void>;
}

export type Plugin = {
  name: string;
  setup: (args: {
    report: (data: EventLike) => Promise<void>;
    config: BaseConfig;
  }) => void;
  onEventBeforeSend?: (originEvent: EventLike) => EventLike;
  onEventSendAfter?: (event: EventLike, res) => void;
};

export interface userData {
  uid: string;

  // business user id
  bizUid: string | number;
  bizUser: { [key: string]: any };
}
