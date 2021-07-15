import { BaseConfig } from "@doras/core";

export const Api = "api";
export const Api_Xhr = "xhr";

export const Error = "error";
export const Error_OnError = "onerror";
export const Error_UnhandledRejection = "unhandledrejection";
export const Error_CustomCatch = "customCatch";

export const Performance = "performance";
export const Performance_Metric = "metric";
export const Performance_Resource = "resource";

export const Resource = "resource";

export const Visit = "visit";
export const Visit_PageView = "pageView";
export const Visit_Entry = "entry";

export type BrowserConfig = BaseConfig & {
  pref?: {
    enable: boolean;
    scriptTiming: boolean;
    xhrTiming: boolean;
  };
};
