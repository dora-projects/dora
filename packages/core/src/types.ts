export interface Data {
  [key: string]: any;
}

export interface BaseConfig {
  serverUrl: string;

  appId: string;
  appEnv: string;
  appVersion: string;

  sampleRate?: number;

  user?: userData;
  transfer?: (mode: string, url: string, data: Data) => Promise<any>;
  plugins?: Plugin[];

  [key: string]: any;
}

export type Transport = (mode: string, url: string, data: Data) => Promise<any>;

export interface EventLike {
  type: "api" | "error" | "visit" | "performance" | "stat";
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
  pageTitle: string;
  pageLocation: string;
  pageLang: string;
}

export interface DeviceField {
  devScreen: string;
  devViewport: string;
  devUa: string;
}

export interface UserField {
  userId: string;
  userInfo: string;
}

// 性能
export interface PerfField {
  perfGroupName: "navigationTiming" | "dataConsumption" | "aggMetric";
}

// 网络
export interface ApiField {
  apiType: string;
  apiUrl: string;
  apiMethod: string;
  apiStatus: string;
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
  statValue: string;
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
  report: (pluginName: string, data: any) => void;
}

export type Plugin = {
  name: string;
  setup: (args: { report: (data: any) => void; config: BaseConfig }) => void;
  onEventBeforeSend?: (originEvent: Event) => Event;
  onEventSendAfter?: (event: Event, res) => void;
};

export interface userData {
  uid: string;
  data: { [key: string]: any };
}
