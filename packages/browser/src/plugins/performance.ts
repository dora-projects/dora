import { getLCP, getFID, getCLS } from "web-vitals";

export const WebVitalsPlugin = (conf?) => {
  return {
    name: "@doras/browser-web-vitals-plugin",
    init: ({ report }) => {
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
    onEventSendAfter: (event, res) => {}
  };
};
