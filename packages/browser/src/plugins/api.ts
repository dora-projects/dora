import { Plugin } from "@doras/core";
import { decorator, isString } from "@doras/shared";

export const ApiPlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-api-plugin",
    setup: ({ report }) => {
      if (!("XMLHttpRequest" in global)) {
        return;
      }

      let requestKeys: XMLHttpRequest[] = [];
      let requestValues: any[] = [];
      const xhrProto = XMLHttpRequest.prototype;

      decorator(
        xhrProto,
        "open",
        function (originalOpen: () => void): () => void {
          return function (...args: any[]): void {
            const xhr = this;

            try {
              const [method, url] = args;
              xhr.__dora__ = { method: method, url: url };

              // url 增加sdk 标识
              if (url === "") {
                xhr.__dora_own_request__ = true;
              }
            } catch (e) {}

            xhr.addEventListener("error", () => xhrErrHandler("error"));
            xhr.addEventListener("timeout", () => xhrErrHandler("timeout"));

            function xhrErrHandler(t): void {
              // statusCode();
              // bodyData();
              if (t === "timeout") {
                xhr.__dora__.client_timeout = xhr.timeout;
              }
            }

            return originalOpen.apply(xhr, args);
          };
        }
      );

      decorator(xhrProto, "onreadystatechange", function (original): Function {
        return function (...readyStateArgs: any[]): void {
          const xhr = this;

          if (xhr.readyState === 4) {
            // statusCode();
            // bodyData();

            // triggerBreadcrumbsHandler(xhr);
            if (xhr.status >= 500) {
              // triggerErrorHandler(`status ${xhr.status}`, {
              //   xhr,
              //   req_end: Date.now()
              // });
            }
          }

          return original.apply(xhr, readyStateArgs);
        };
      });

      decorator(
        xhrProto,
        "send",
        function (originalSend: () => void): () => void {
          return function (...args: any[]): void {
            const xhr = this;
            requestKeys.push(xhr);
            requestValues.push({ sendTime: Date.now(), args });

            return originalSend.apply(xhr, args);
          };
        }
      );
    },
    onEventBeforeSend: (event) => {
      return event;
    },
    onEventSendAfter: () => {}
  };
};
