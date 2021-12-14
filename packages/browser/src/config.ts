import {
  ClientConfig,
  ErrorLike,
  IssueArgs,
  Schema,
  StatArgs,
  UserInfo
} from "@doras/types";
import {
  isString,
  isEmpty,
  isUrl,
  isBoolean,
  isObject,
  isNumber,
  logger,
  isPrimitive,
  isFunction
} from "@doras/shared";
import { verify } from "@doras/shared/src/verify";

export const configSchema: Schema = {
  serverUrl: {
    message: "should be a url string",
    validate: (value) => !isEmpty(value) && isString(value) && isUrl(value)
  },
  appKey: {
    message: "should be a string",
    validate: (value) => !isEmpty(value) && isString(value)
  },
  appEnv: {
    message: "should be a string",
    validate: (value) => !isEmpty(value) && isString(value)
  },
  appVersion: {
    message: "should be a string",
    validate: (value) => !isEmpty(value) && isString(value)
  },
  debug: {
    message: "should be an boolean",
    validate: (value) => isBoolean(value)
  },
  useDefaultPlugins: {
    message: "should be an boolean",
    validate: (value) => isBoolean(value)
  },
  sampleRate: {
    message: "should be an number",
    validate: (value) => isNumber(value) && value <= 1
  },
  maxBreadcrumbs: {
    message: "should be an number",
    validate: (value) => isNumber(value) && value < 50
  },
  user: {
    message: "should be an object",
    validate: (value) => isEmpty(value) || isObject(value)
  },
  beforeBreadcrumb: {
    message: "should be an function",
    validate: (value) => isEmpty(value) || isFunction(value)
  },
  beforeSend: {
    message: "should be an function",
    validate: (value) => isEmpty(value) || isFunction(value)
  }
};

export type BrowserOptions = ClientConfig & {};

const defaultConf: BrowserOptions = {
  serverUrl: "",
  appKey: "",
  appEnv: "",
  appVersion: "",
  debug: true,
  useDefaultPlugins: true,
  sampleRate: 1,
  maxBreadcrumbs: 15,
  user: null
};

export const verifyOptions = (conf: BrowserOptions) => {
  return verify<BrowserOptions>(conf, configSchema, defaultConf);
};

export const verifySetUser = (user: UserInfo): { pass: boolean } => {
  if (isEmpty(user) || isObject(user)) {
    logger.error("setUser args require a object");
    return { pass: true };
  }
  return { pass: false };
};

const statSchema = {
  category: {
    message: "should be a url string",
    validate: (value) => !isEmpty(value) && isString(value)
  },
  label: {
    message: "should be a string",
    validate: (value) => !isEmpty(value) && isString(value)
  },
  stringValue: {
    message: "should be a string",
    validate: (value) => isEmpty(value) || isString(value)
  },
  numberValue: {
    message: "should be a number",
    validate: (value) => isEmpty(value) || isNumber(value)
  }
};

export const verifyStat = (args: StatArgs): { pass: boolean } => {
  return verify(args, statSchema);
};

const issueSchema = {
  message: {
    message: "should be a url string",
    validate: (value) => !isEmpty(value) && isString(value) && isUrl(value)
  },
  detail: {
    message: "should be a string",
    validate: (value) => isEmpty(value) || isString(value)
  },
  contact: {
    message: "should be a string",
    validate: (value) => isEmpty(value) || isString(value)
  }
};

export const verifyIssue = (args: IssueArgs): { pass: boolean } => {
  return verify(args, issueSchema);
};

export const verifyCatchError = (e: ErrorLike): { pass: boolean } => {
  if (e || isPrimitive(e) || (e.message && e.stack)) {
    return { pass: true };
  }
  return { pass: false };
};
