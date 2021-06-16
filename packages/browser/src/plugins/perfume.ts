import { Plugin } from "@doras/core";
import Perfume from "perfume.js";

export const PerfumePlugin = (conf?): Plugin => {
  return {
    name: "@doras/perfume-plugin",
    setup: ({ report }) => {
      let bucket = {};
      new Perfume({
        resourceTiming: true,
        analyticsTracker: ({ metricName, data }) => {
          switch (metricName) {
            case "navigationTiming":
              report({
                type: "performance",
                subType: "navigationTiming",
                performance: data
              }).catch((e) => {});

              return;

            case "dataConsumption":
              report({
                type: "performance",
                subType: "dataConsumption",
                performance: data
              }).catch((e) => {});

              return;

            default:
              // 合并上报
              const aggMetricNames = [
                "fp",
                "fcp",
                "lcp",
                // 'lcpFinal',
                "fid",
                "cls",
                // 'clsFinal',
                "tbt"
                // 'tbt10S',
                // 'tbtFinal',
              ];
              if (aggMetricNames.includes(metricName)) {
                bucket[metricName] = data;
                if (Object.keys(bucket).length >= aggMetricNames.length) {
                  report({
                    type: "performance",
                    subType: "aggMetric",
                    performance: { ...bucket }
                  }).catch((e) => {});

                  bucket = {};
                }
              }
              return;
          }
        }
      });
    }
  };
};
