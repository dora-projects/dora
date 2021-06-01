import { Plugin } from "@doras/core";

export const ApiPlugin = (conf): Plugin => {
  return {
    name: "@doras/browser-api-plugin",
    setup: ({ report }) => {},
    onEventBeforeSend: (event) => {
      return event;
    },
    onEventSendAfter: () => {}
  };
};
