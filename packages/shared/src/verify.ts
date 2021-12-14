import { isEmptyObject, logger } from "@doras/shared";
import { Schema } from "@doras/types";

export function verify<T extends Object>(
  conf: T,
  schema: Schema,
  defaultValues: T = null
): { conf: T; pass: boolean } {
  // merge default
  const config = defaultValues ? Object.assign(defaultValues, conf) : conf;

  // verify
  const keys = Object.keys(schema) || [];
  const verifyResult = keys.reduce(
    (acc, key) => {
      const value = config[key];
      const { message, validate } = schema[key];

      const valid = validate(value);
      if (!valid) {
        acc.errors[key] = message;
      }
      return acc;
    },
    { errors: {} }
  );

  if (!isEmptyObject(verifyResult.errors)) {
    logger.error(
      `config verify ${JSON.stringify(verifyResult.errors, null, 2)}`
    );
    return { conf: config, pass: false };
  }

  return { conf: config, pass: true };
}
