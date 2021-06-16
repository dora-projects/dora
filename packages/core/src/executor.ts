import { logger } from "./logger";

export const executorSetups = (funcArray, client, config) => {
  funcArray.forEach(async (func) => {
    try {
      logger().debug(`${func.pluginName} setup exec!`);
      const report = client.report.bind(client, func.pluginName);
      await func.call(null, { report, config });
    } catch (e) {
      logger().error(`${func.pluginName} init catch error, so break！！！ `, e);
    }
  });
};

export const executorBeforeSend = async (funcArray, originEvent) => {
  let acc = originEvent;

  for await (const func of funcArray) {
    try {
      const result = await func.call(null, acc);
      logger().debug(
        `${func.pluginName} beforeSend hook executed, got result: `,
        result
      );
      acc = result;

      if (!result) {
        logger().debug(
          `${func.pluginName} beforeSend get false result, so break！！！ `,
          result
        );
        break;
      }
    } catch (e) {
      logger().error(
        `${func.pluginName} beforeSend catch error, so break！！！ `,
        e
      );
      acc = null;
      break;
    }
  }

  return acc;
};

export const executorSendAfter = async (funcArray, event, res) => {
  for await (const func of funcArray) {
    try {
      const result = await func.call(null, event, res);
      logger().debug(
        `${func.pluginName} beforeSend hook executed, got result: `,
        result
      );

      if (!result) {
        logger().debug(
          `${func.pluginName} beforeSend get false result, so break！！！ `,
          result
        );
        break;
      }
    } catch (e) {
      logger().error(
        `${func.pluginName} beforeSend catch error, so break！！！ `,
        e
      );
      break;
    }
  }
};
