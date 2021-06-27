import { Plugin } from "@doras/core";
import {
  isString,
  isPrimitive,
  createSummary,
  errorFormat
} from "@doras/shared";
import { Error, Error_OnError, Error_UnhandledRejection } from "../types";

export const ErrorPlugin = (): Plugin => {
  return {
    name: "@doras/browser-error-plugin",
    setup: ({ report }) => {
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
          type: Error,
          subType: Error_OnError,
          error: { msg, url, line, column, ...detail }
        }).catch((e) => {});

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
          type: Error,
          subType: Error_UnhandledRejection,
          error: detail
        }).catch((e) => {});

        if (oldOnUnhandledRejectionHandler) {
          return oldOnUnhandledRejectionHandler?.apply(this, arguments);
        }
        return true;
      };
    }
  };
};
