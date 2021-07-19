import { BaseClient, BaseConfig } from "./types";
import { debug } from "@doras/shared";

export const executorSetups = (
  funcArray,
  client: BaseClient,
  config: BaseConfig
) => {
  funcArray.forEach(async (func) => {
    try {
      debug(`setup ${func.pluginName}`);
      const report = client.report.bind(client, func.pluginName);
      await func.call(null, { report, config });
    } catch (e) {
      debug(`setup catch error ${func.pluginName}`, e);
    }
  });
};

export const executorBeforeSend = async (funcArray, originEvent) => {
  if (!funcArray || funcArray.length === 0) return;
  let acc = originEvent;
  for await (const func of funcArray) {
    try {
      const result = await func.call(null, acc);
      debug(`beforeSend ${func.pluginName}`, result);
      acc = result;

      if (!result) {
        debug(`beforeSend break ${func.pluginName}`, result);
        break;
      }
    } catch (e) {
      debug(`beforeSend catch error ${func.pluginName}`, e);
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
      debug(`beforeSend hook executed ${func.pluginName}`, result);

      if (!result) {
        debug(`beforeSend get false ${func.pluginName}`, result);
        break;
      }
    } catch (e) {
      debug(`beforeSend catch error ${func.pluginName}`, e);
      break;
    }
  }
};
