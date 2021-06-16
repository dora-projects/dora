export interface Data {
  [key: string]: any;
}

export interface BaseConfig {
  serverUrl: string;
  appId: string;
  appEnv: string;
  appVersion: string;
  user?: userData;
  userStore?: () => userData;
  sampleRate?: number;
  transfer?: (mode: string, url: string, data: Data) => Promise<any>;
  plugins?: Plugin[];
}

export type Transport = (mode: string, url: string, data: Data) => Promise<any>;

export interface BaseEvent {
  type: "api" | "error" | "page" | "performance" | "stat";
  subType: string;

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
  devType: string;
  devScreen: string;
  devViewport: string;
  devScreenColors: string;
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

// 事件
export type PageEvent = BaseEvent & PageField & DeviceField & UserField;

export type ApiEvent = BaseEvent &
  PageField &
  DeviceField &
  UserField &
  ApiField;

export type ErrorEvent = BaseEvent &
  PageField &
  DeviceField &
  UserField &
  ErrorField;

export type PerfEvent = BaseEvent & PageField & DeviceField & PerfField;

export type StatEvent = BaseEvent & PageField & StatField & UserField;

export interface BaseClient {
  use: (plugins: Plugin[]) => void;
  statistic: (data: StatField) => void;
  report: (pluginName: string, data: any) => void;
}

export type Plugin = {
  name: string;
  setup: (args: { report: (data: any) => void }) => void;
  onEventBeforeSend?: (originEvent: Event) => Event;
  onEventSendAfter?: (event: Event, res) => void;
};

export interface userData {
  uid: string;
  data: { [key: string]: any };
}
