import { isString, isBoolean, isEmpty, isObject, isUrl } from "./utils";

export const BaseSchema = {
  serverUrl: {
    defaultValue: undefined,
    message: "should be a url string",
    require: true,
    validate: (value) => !isEmpty(value) && isString(value) && isUrl(value)
  },
  appId: {
    defaultValue: undefined,
    message: "is required",
    require: true,
    validate: (value) => !isEmpty(value) && isString(value)
  },
  appEnv: {
    defaultValue: undefined,
    message: "should be a string",
    require: true,
    validate: (value) => !isEmpty(value) && isString(value)
  },
  appVersion: {
    defaultValue: undefined,
    message: "should be a string",
    require: true,
    validate: (value) => !isEmpty(value) && isString(value)
  },
  debug: {
    defaultValue: false,
    message: "should be an bol",
    require: false,
    validate: (value) => isBoolean(value)
  },
  user: {
    defaultValue: undefined,
    message: "should be an object",
    require: false,
    validate: (value) =>
      value === undefined || (isObject(value) && Object.keys(value).length <= 6)
  }
};

export function verifyConfig<D>(config: D, schema) {
  const keys = Object.keys(schema) || [];

  return keys.reduce(
    (accumulator, key) => {
      const configValue = config[key];
      const { defaultValue, message, validate, require } = schema[key];

      // 检查必填
      if (require && isEmpty(configValue)) {
        accumulator.config[key] = configValue;
        accumulator.errors[key] = "is required";
        return accumulator;
      }

      // 校验值
      if (configValue !== undefined) {
        const valid = validate(configValue);
        if (valid) {
          accumulator.config[key] = configValue;
        } else {
          accumulator.config[key] = defaultValue;
          accumulator.errors[key] = message;
        }
        return accumulator;
      }

      // 非必填 默认值
      accumulator.config[key] = defaultValue;
      return accumulator;
    },
    {
      config: {} as D,
      errors: {}
    }
  );
}
