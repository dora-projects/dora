import { Plugin } from "@doras/core";
import { getLCP, getFID, getCLS } from "web-vitals";

export const WebVitalsPlugin = (conf): Plugin => {
  return {
    name: "@doras/browser-web-vitals-plugin",
    setup: ({ report }) => {
      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getLCP(sendToAnalytics);

      function sendToAnalytics(metric) {
        report({ [metric.name]: metric.value });
      }
    },
    onEventBeforeSend: (event) => {
      return event;
    },
    onEventSendAfter: () => {}
  };
};
