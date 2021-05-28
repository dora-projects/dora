import { LEVEL } from "./logger";

export interface InitConfig {
  appId: string;
  appVersion: string;
  logLevel: LEVEL;
  sampleRate: number;
  userId: string;
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
export interface NetworkField {
  netType: string;
  netUrl: string;
  netMethod: string;
  netStatus: string;
  netRequest: string;
  netResponse: string;
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
