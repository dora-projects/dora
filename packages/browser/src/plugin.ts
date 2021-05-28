import { logger } from "@doras/core";

export const LogPlugin = (conf?) => {
  return {
    name: "dora-log-plugin",
    init: ({ report }) => {
      setTimeout(() => {
        report({ name: "123123123123" });
      }, 1000);
    },
    onEventBeforeSend: (event) => {
      return event;
    },
    onEventSendAfter: (event, res) => {}
  };
};

export const ErrorPlugin = (conf?) => {
  return {
    name: "dora-error-plugin",
    init: ({ report }) => {},
    onEventBeforeSend: (event) => {}
  };
};
