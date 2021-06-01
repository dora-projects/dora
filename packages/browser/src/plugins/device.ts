import { Plugin } from "@doras/core";

export const DevicePlugin = (conf): Plugin => {
  return {
    name: "@doras/browser-device-plugin",
    setup: ({ report }) => {},
    onEventBeforeSend: (event) => {
      return event;
    },
    onEventSendAfter: () => {}
  };
};
