import { Plugin, constant } from "@doras/core";
import { getSelector } from "@doras/shared";

export function ResourcePlugin(): Plugin {
  return {
    name: "resource",
    register({ report }) {
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
            // @ts-ignore
            name: target && target.name,
            tagName: target && target.tagName,
            // @ts-ignore
            src: target && target.src,
            // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
            nodeType: target && target.nodeType,
            selector,
            outerHTML
          };
          report({
            type: constant.RESOURCE,
            subtype: constant.RESOURCE_ERROR,
            data: detail
          });
        },
        true
      );
    },
    unregister: () => {}
  };
}
