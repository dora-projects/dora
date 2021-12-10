import { Plugin, constant } from "@doras/core";
import { isString, errorFormat } from "@doras/shared";

export function ErrorPlugin(): Plugin {
  return {
    name: "error",
    register: ({ report }) => {
      // onerror
      const oldOnErrorHandler = window.onerror;
      window.onerror = function (msg: string, url, line, column, error) {
        // ignore ResizeObserver loop limit exceeded
        if (
          isString(msg) &&
          msg.indexOf("ResizeObserver loop limit exceeded") > -1
        ) {
          return;
        }

        // error format
        const detail = errorFormat(error);
        if (!detail.error && !detail.stack) {
          return;
        }

        report({
          type: constant.ERROR,
          subtype: constant.ERROR_ONERROR,
          data: { msg, url, line, column, ...detail }
        });

        if (oldOnErrorHandler) {
          return oldOnErrorHandler.apply(this, arguments);
        }
        return false;
      };

      // unhandledrejection
      const oldOnUnhandledRejectionHandler = window?.onunhandledrejection;
      window.onunhandledrejection = function (e: any): boolean {
        let error = e;

        try {
          if ("reason" in e) {
            error = e.reason;
          } else if ("detail" in e && "reason" in e.detail) {
            error = e.detail.reason;
          }
        } catch (_) {}

        // error format
        const detail = errorFormat(error);
        if (!detail.error && !detail.stack) {
          return;
        }

        report({
          type: constant.ERROR,
          subtype: constant.ERROR_UNHANDLEDREJECTION,
          data: detail
        });

        if (oldOnUnhandledRejectionHandler) {
          return oldOnUnhandledRejectionHandler?.apply(this, arguments);
        }
        return true;
      };
    },
    unregister(): void {}
  };
}
