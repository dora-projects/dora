import { ApiField, Plugin } from "@doras/core";
import { decorator, isString } from "@doras/shared";
import { Api, Api_Xhr } from "../types";

export const ApiPlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-api-plugin",
    setup: ({ report, config }) => {
      if (!("XMLHttpRequest" in window)) {
        return;
      }

      const xhrProto = XMLHttpRequest.prototype;

      decorator(xhrProto, "open", replaceOpen);
      decorator(xhrProto, "send", replaceSend);

      function replaceOpen(originalOpen: () => void): () => void {
        return function (...args: any[]): void {
          const xhr = this;
          decorator(xhr, "onreadystatechange", replaceOnreadystatechange);
          xhr.addEventListener("timeout", () => xhrErrHandler("timeout"));
          xhr.addEventListener("error", () => xhrErrHandler("error"));

          const [method, url] = args;
          xhr.__dora__ = { method: method, url: url };
          xhr.__dora__.timeout = xhr.timeout;

          // sdk request
          if (url.indexOf(config.serverUrl) > -1) {
            xhr.__dora_own_request__ = true;
          }

          function xhrErrHandler(t): void {
            xhr.__dora__.type = t;
            if (xhr.__dora_own_request__) return;
            reportApiError(xhr);
          }

          function replaceOnreadystatechange(originalStatechange): Function {
            return function (...readyStateArgs: any[]): void {
              if (xhr.readyState === 4) {
                xhr.__dora__.status = xhr.status;
                if (xhr.status >= 500) {
                  // sdk 错误不上报
                  if (xhr.__dora_own_request__) return;
                  reportApiError(xhr);
                }
              }
              originalStatechange?.apply(xhr, readyStateArgs);
            };
          }

          return originalOpen.apply(xhr, args);
        };
      }

      function replaceSend(originalSend: () => void): () => void {
        return function (...args: any[]): void {
          const xhr = this;

          xhr.__dora__.sendTime = Date.now();
          xhr.__dora__.bodyData = args.length > 0 ? args[0] : null;

          return originalSend.apply(xhr, args);
        };
      }

      function reportApiError(xhr) {
        const {
          type = "serverError",
          url,
          method,
          status,
          bodyData,
          timeout
        } = xhr.__dora__;

        const errorReason: ApiField = {
          type,
          url,
          method,
          timeout,
          status,
          request: bodyData,
          response: xhr.response
        };

        report({
          type: Api,
          subType: Api_Xhr,
          [Api]: errorReason
        }).catch(() => {});
      }
    }
  };
};
