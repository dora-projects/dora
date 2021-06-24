import { Plugin } from "@doras/core";
import { decorator, parseUrl } from "@doras/shared";
import { Visit, Visit_Entry, Visit_PageView } from "../types";

export const VisitPlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-visit-plugin",
    setup: ({ report, config }) => {
      let lastHref;

      // history
      historyListener();

      function historyListener() {
        decorator(window?.history, "pushState", historyReplacement);
        decorator(window?.history, "replaceState", historyReplacement);
        // 后退、前进、a 标签的锚点 触发
        decorator(window, "onpopstate", () => {
          const current = window?.location?.href;
          urlChange(lastHref, current);
        });

        function historyReplacement(original: () => void) {
          return function (data: any, title: string, url?: string) {
            if (url) {
              urlChange(lastHref, String(url));
            }
            return original.apply(this, [data, title, url]);
          };
        }
      }

      // hash
      window.addEventListener("hashchange", hashListener, true);

      function hashListener(e: HashChangeEvent) {
        const { oldURL, newURL } = e;
        urlChange(oldURL, newURL);
      }

      function urlChange(from?: string, to?: string) {
        const formParsed = parseUrl(from);
        const toParsed = parseUrl(to);

        lastHref = to;

        // 页面没有跳转
        if (formParsed.relative === toParsed.relative) return;

        // 入口
        if (!formParsed.path) return;

        const visitData = {
          from: formParsed.relative,
          to: toParsed.relative
        };
        report({
          type: Visit,
          subType: Visit_PageView,
          [Visit]: visitData
        }).catch(() => {});
      }

      // dom ready 页面加载时统计
      document.addEventListener("DOMContentLoaded", function (event) {
        const current = window?.location?.href;
        const parsed = parseUrl(current);
        const visitData = {
          from: undefined,
          to: parsed.relative
        };
        report({
          type: Visit,
          subType: Visit_Entry,
          [Visit]: visitData
        }).catch(() => {});
      });
    }
  };
};
