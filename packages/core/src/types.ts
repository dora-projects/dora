import { LEVEL } from "./logger";

export interface InitConfig {
  appId: string;
  appVersion: string;
  logLevel?: LEVEL;
  sampleRate?: number;
  userId?: string;
  transfer?: (data) => Promise<any>;
  plugins?: any[];
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
  use: (plugins: PluginType[]) => void;
  statistic: (data: StatArgs) => void;
  report: (pluginName: string, data: any) => void;
}

export type PluginType = () => {
  name: string;
  init: (args: { report: (data: any) => void }) => void;
  onEventBeforeSend: (any) => any;
  onEventSendAfter: (any) => void;
};
