import { Plugin, constant } from "@doras/core";
import { numFixed, isContains } from "@doras/shared";
import Perfume from "perfume.js";

export interface Options {
  enable: boolean;
  scriptTiming: boolean;
  xhrTiming: boolean;
}

const MetricNameBucket = {};

export function PerfumePlugin(options?: Options): Plugin {
  const {
    enable = true,
    xhrTiming = true,
    scriptTiming = true
  } = options || {};

  return {
    name: "perfume",
    register({ report }) {
      const isOpenResourceTiming = xhrTiming || scriptTiming || true;
      if (!enable) return;

      new Perfume({
        resourceTiming: isOpenResourceTiming,
        analyticsTracker: (options) => {
          const { metricName, data } = options;
          MetricNameBucket[metricName] = data;

          analyticsTool.collectGroup(["ttfb", "fp", "fcp"], report);
          analyticsTool.collectGroup(["fid", "lcp", "cls"], report);

          if (metricName === "resourceTiming") {
            if (scriptTiming) {
              analyticsTool.collectResource("script", data, report);
            }
            if (xhrTiming) {
              analyticsTool.collectResource("xmlhttprequest", data, report);
            }
          }
        }
      });
    },
    unregister() {}
  };
}

const analyticsTool = {
  collectGroup: (keys, report) => {
    if (isContains(MetricNameBucket, keys)) {
      const data = {};
      keys.forEach((k) => {
        data[k] = numFixed(MetricNameBucket[k], 3);
        delete MetricNameBucket[k];
      });

      report({
        type: constant.PERFORMANCE,
        subtype: constant.PERFORMANCE_METRIC,
        data: data
      });
    }
  },
  collectResource: (initiatorType, data, report) => {
    if (initiatorType === data["initiatorType"]) {
      const name = data["name"];
      const duration = data["duration"];

      report({
        type: constant.RESOURCE,
        subtype: constant.RESOURCE_TIMING,
        data: {
          tag: initiatorType,
          name,
          duration: numFixed(duration, 3)
        }
      });
    }
  }
};
