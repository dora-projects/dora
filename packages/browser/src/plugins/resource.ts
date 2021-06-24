import { Plugin } from "@doras/core";
import { getSelector } from "@doras/shared";
import { Resource } from "../types";

export const ResourcePlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-resource-plugin",
    setup: ({ report }) => {
      window.addEventListener?.(
        "error",
        function (e) {
          if (!e) return;

          const target = (e.target || e.srcElement) as any;
          const isElementTarget = target instanceof HTMLElement;

          // js error不再处理
          if (!isElementTarget) return;

          const selector = getSelector(e);
          const { outerHTML } = target as any;

          const detail = {
            id: target && target.id,
            className: target && target.className,
            name: target && target.name,
            tagName: target && target.tagName,
            src: target && target.src,
            // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
            nodeType: target && target.nodeType,
            selector,
            outerHTML
          };
          report({
            type: Resource,
            [Resource]: detail
          }).catch((e) => {});
        },
        true
      );
    },
    onEventBeforeSend: (event) => {
      return event;
    }
  };
};
