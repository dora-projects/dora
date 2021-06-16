import { Plugin } from "@doras/core";

export const VisitPlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-visit-plugin",
    setup: ({ report }) => {},
    onEventBeforeSend: (event) => {
      return event;
    },
    onEventSendAfter: () => {}
  };
};
