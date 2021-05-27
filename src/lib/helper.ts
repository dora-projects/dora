const prefix = 'Dora';

export const logger = {
  log: console.log.bind(console, `%c ${prefix}`, `font-size:16px`),
  info: console.info.bind(console, `%c ${prefix}`, `font-size:16px`),
  warn: console.warn.bind(console, `%c ${prefix}`, `font-size:16px`),
  error: console.error.bind(console, `%c ${prefix}`, `font-size:16px`),
};

export const noopLogger = {
  log: () => {
  },
  info: () => {
  },
  warn: () => {
  },
  error: () => {
  },
};

export const executorInit = (funcArray, client) => {
  funcArray.forEach(async (func) => {
    try {
      logger.info(`${func.pluginName} init exec!`);
      const report = client.report.bind(client, func.pluginName);
      await func.call(null, { report });
    } catch (e) {
      logger.error(e);
    }
  });
};

export const executorBeforeSend = async (funcArray, originEvent) => {
  let acc = originEvent;

  for await (const func of funcArray) {
    try {
      const result = await func.call(null, acc);
      logger.info(`${func.pluginName} beforeSend hook executed, got result: `, result);
      acc = result;
      if (!result) {
        logger.warn(`${func.pluginName} beforeSend get false result, so break！！！ `, result);
        break;
      }
    } catch (e) {
      logger.error(`${func.pluginName} beforeSend catch error, so break！！！ `, e);
      acc = null;
      break;
    }
  }


  return acc;
};


