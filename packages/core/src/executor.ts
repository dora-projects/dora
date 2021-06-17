import { BaseClient, BaseConfig } from "./types";
import { log } from "@doras/shared";

export const executorSetups = (
  funcArray,
  client: BaseClient,
  config: BaseConfig
) => {
  funcArray.forEach(async (func) => {
    try {
      log(`setup ${func.pluginName}`);
      const report = client.report.bind(client, func.pluginName);
      await func.call(null, { report, config });
    } catch (e) {
      log(`setup catch error ${func.pluginName}`, e);
    }
  });
};

export const executorBeforeSend = async (funcArray, originEvent) => {
  if (!funcArray || funcArray.length === 0) return;
  let acc = originEvent;
  for await (const func of funcArray) {
    try {
      const result = await func.call(null, acc);
      log(`beforeSend ${func.pluginName}`, result);
      acc = result;

      if (!result) {
        log(`beforeSend break ${func.pluginName}`, result);
        break;
      }
    } catch (e) {
      log(`beforeSend catch error ${func.pluginName}`, e);
      acc = null;
      break;
    }
  }

  return acc;
};

export const executorSendAfter = async (funcArray, event) => {
  if (!funcArray || funcArray.length === 0) return;
  for await (const func of funcArray) {
    try {
      const result = await func.call(null, event);
      log(`beforeSend hook executed ${func.pluginName}`, result);

      if (!result) {
        log(`beforeSend get false ${func.pluginName}`, result);
        break;
      }
    } catch (e) {
      log(`beforeSend catch error ${func.pluginName}`, e);
      break;
    }
  }
};
