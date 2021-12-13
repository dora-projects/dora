import { StackFrame, StackTrace } from "./tracekit";

interface Exception {
  values: {
    type: string;
    value: string;
    stacktrace?: {
      frames: StackFrame[];
    };
  }[];
}

export const exceptionFromStacktrace = (stacktrace: StackTrace): Exception => {
  const exception = {
    type: stacktrace.name,
    value: stacktrace.message,
    stacktrace: {
      frames: stacktrace.stack
    }
  };
  return {
    values: [exception]
  };
};

export const exceptionFromRejectionWithPrimitive = (reason): Exception => {
  return {
    values: [
      {
        type: "UnhandledRejection",
        // String() is needed because the Primitive type includes symbols (which can't be automatically stringified)
        value: `promise rejection with value: ${String(reason)}`,
        stacktrace: null
      }
    ]
  };
};
