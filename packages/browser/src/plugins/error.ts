import { Plugin } from "@doras/core";
import { isString } from "@doras/shared";

export const ErrorPlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-error-plugin",
    setup: ({ report }) => {
      const oldOnErrorHandler = window.onerror;
      window.onerror = function (msg: string, url, line, column, error) {
        // ignore ResizeObserver loop limit exceeded
        if (
          isString(msg) &&
          msg.indexOf("ResizeObserver loop limit exceeded") > -1
        ) {
          return;
        }

        report({
          type: "error",
          error: { msg, url, line, column, error }
        }).catch((e) => {});

        if (oldOnErrorHandler) {
          return oldOnErrorHandler.apply(this, arguments);
        }
        return false;
      };
    }
  };
};
