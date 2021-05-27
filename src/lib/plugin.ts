import { logger } from "./helper";

export const LogPlugin = (conf?) => {
  return {
    name: "dora-log-plugin",
    init: ({ report }) => {
      setTimeout(() => {
        report({ name: "123123123123" });
      }, 1000);
    },
    onEventBeforeSend: (event) => {
    throw new Error("dasdasd")
    },
    onEventSendAfter: (event, res) => {
    },
  };
};

export const ErrorPlugin = (conf?) => {
  return {
    name: "dora-error-plugin",
    init: ({ report }) => {

    },
    onEventBeforeSend: (event) => {
    },
  };
};
