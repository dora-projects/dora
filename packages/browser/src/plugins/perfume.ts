import { Plugin } from "@doras/core";
import Perfume from "perfume.js";
import {
  Performance,
  Performance_Metric,
  Performance_Resource
} from "../types";

export const PerfumePlugin = (conf: {
  enable: boolean;
  scriptTiming: boolean;
  xhrTiming: boolean;
}): Plugin => {
  return {
    name: "@doras/perfume-plugin",
    setup: ({ report }) => {
      const isOpenResourceTiming = conf.scriptTiming || conf.xhrTiming;
      if (!conf.enable) return;

      new Perfume({
        resourceTiming: isOpenResourceTiming,
        analyticsTracker: (options) => {
          const { metricName, data } = options;
          bucket[metricName] = data;

          analyticsTool.collectGroup("p1", ["ttfb", "fp", "fcp"], report);
          analyticsTool.collectGroup("p2", ["fid", "lcp", "cls"], report);

          if (metricName === "resourceTiming") {
            if (conf.scriptTiming) {
              analyticsTool.collectResource("script", data, report);
            }
            if (conf.xhrTiming) {
              analyticsTool.collectResource("xmlhttprequest", data, report);
            }
          }
        }
      });
    }
  };
};

const bucket = {};
const analyticsTool = {
  collectGroup: (name, keys, report) => {
    if (isContains(bucket, keys)) {
      const data = {};
      keys.forEach((k) => {
        data[k] = trans(bucket[k], 3);
        delete bucket[k];
      });

      report({
        type: Performance,
        subType: Performance_Metric,
        [Performance]: data
      });
    }
  },
  collectResource: (initiatorType, data, report) => {
    if (initiatorType === data["initiatorType"]) {
      const name = data["name"];
      const duration = data["duration"];

      report({
        type: Performance,
        subType: Performance_Resource,
        [Performance]: {
          initiatorType,
          name,
          duration: trans(duration, 3)
        }
      });
    }
  }
};

function isContains(bucket, keys: string[]) {
  const bKeys = Object.keys(bucket);
  return keys.every((k) => bKeys.includes(k));
}

function trans(num: any, digit: number): number {
  if (isNaN(num)) return 0;
  return +num.toFixed(digit);
}
