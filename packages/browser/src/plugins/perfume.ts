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
          if (metricName === "navigationTiming") {
            const event = handleNavigationTiming(data);
            report(event);
          }
          if (metricName === "dataConsumption") {
            const event = handleDataConsumption(data);
            report(event);
          }

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
              const event = handleAggMetric(data);
              report(event);
            }
          }
        }
      });
    }
  };
};

function handleNavigationTiming(data) {
  const {
    fetchTime,
    workerTime,
    totalTime,
    downloadTime,
    timeToFirstByte,
    headerSize,
    dnsLookupTime
  } = data;
  return { type: "performance", subType: "navigationTiming", ...data };
}

function handleDataConsumption(data) {
  const { beacon, css, fetch, img, other, script, total, xmlhttprequest } =
    data;

  return { type: "performance", subType: "dataConsumption", ...data };
}

function handleAggMetric(data) {
  return { type: "performance", subType: "aggMetric", ...data };
}
