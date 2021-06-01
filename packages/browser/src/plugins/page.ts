import { Plugin } from "@doras/core";

export const PagePlugin = (conf): Plugin => {
  return {
    name: "@doras/browser-page-plugin",
    setup: ({ report }) => {},
    onEventBeforeSend: (event) => {
      return event;
    },
    onEventSendAfter: () => {}
  };
};
