import { Plugin } from "@doras/core";

export const ErrorPlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-error-plugin",
    setup: ({ report }) => {
      const oldOnErrorHandler = window.onerror;
      window.onerror = function (msg, url, line, column, error) {
        report({ msg, url, line, column, error });
        if (oldOnErrorHandler) {
          return oldOnErrorHandler.apply(this, arguments);
        }
        return false;
      };
    },
    onEventBeforeSend: (event) => {
      return event;
    }
  };
};
