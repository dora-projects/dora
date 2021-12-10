import { Plugin, constant } from "@doras/core";
import {
  computeStackTrace,
  isError,
  isPrimitive,
  StackFrame,
  StackTrace
} from "@doras/shared";

export function ErrorPlugin(): Plugin {
  return {
    name: "error",
    register: ({ report }) => {
      // onerror
      // const oldOnErrorHandler = window.onerror;
      // window.onerror = function (msg: string, url, line, column, error) {
      //   // ignore ResizeObserver loop limit exceeded
      //   if (
      //     isString(msg) &&
      //     msg.indexOf("ResizeObserver loop limit exceeded") > -1
      //   ) {
      //     return;
      //   }
      //
      //   // error format
      //   const detail = errorFormat(error);
      //   if (!detail.error && !detail.stack) {
      //     return;
      //   }
      //
      //   report({
      //     type: constant.ERROR,
      //     subtype: constant.ERROR_ONERROR,
      //     data: { msg, url, line, column, ...detail }
      //   });
      //
      //   if (oldOnErrorHandler) {
      //     return oldOnErrorHandler.apply(this, arguments);
      //   }
      //   return false;
      // };

      // error Listener
      window.addEventListener(
        "error",
        (e: ErrorEvent) => {
          if (e && e.error && isError(e.error)) {
            const result = computeStackTrace(e.error);
            const ex = exceptionFromStacktrace(result);

            report({
              type: constant.ERROR,
              subtype: constant.ERROR_LISTENER,
              data: {
                exception: ex
              }
            });
          }
        },
        true
      );

      // unhandledrejection
      window.addEventListener(
        "unhandledrejection",
        (e: PromiseRejectionEvent) => {
          if (e && "reason" in e) {
            const err = e.reason;

            let ex = null;
            //
            if (isPrimitive(err)) {
              ex = exceptionFromRejectionWithPrimitive(err);

              //
            } else if (isError(err)) {
              const stacktrace = computeStackTrace(err);
              ex = exceptionFromStacktrace(stacktrace);
            } else {
              // todo unknown
              return;
            }

            report({
              type: constant.ERROR,
              subtype: constant.ERROR_UNHANDLEDREJECTION,
              data: {
                exception: ex,
                rejection: true
              },
              originError: err
            });
          }
        }
      );
    },
    unregister(): void {}
  };
}

interface Exception {
  values: {
    type: string;
    value: string;
    stacktrace?: {
      frames: StackFrame[];
    };
  }[];
}

const exceptionFromStacktrace = (stacktrace: StackTrace): Exception => {
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

const exceptionFromRejectionWithPrimitive = (reason): Exception => {
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
