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
  perfName: string;
  perfValue: number;
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
export interface EventField {
  eventCategory: string;
  eventAction: string;
  eventLabel: string;
  eventValue: string;
}

export interface StatArgs {
  category: string;
  action: string;
  label: string;
  value: string;
}

export interface BaseClient {
  use: (plugins: Plugin[]) => void;
  statistic: (data: StatArgs) => void;
  report: (pluginName: string, data: any) => void;
}

export interface Event {
  type: string;

  [key: string]: any;
}

export type Plugin = {
  name: string;
  setup: (args: { report: (data: any) => void }) => void;
  onEventBeforeSend?: (e: Event) => Event;
  onEventSendAfter?: (any) => void;
};

export interface userData {
  uid: string;
  data: { [key: string]: any };
}
