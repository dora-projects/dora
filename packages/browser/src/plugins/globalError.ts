import { Plugin, constant } from "@doras/core";
import {
  computeStackTrace,
  createSummary,
  isError,
  isPrimitive,
  exceptionFromRejectionWithPrimitive,
  exceptionFromStacktrace
} from "@doras/shared";
import { PluginReport } from "@doras/types";

let _originOnErrorHandler: OnErrorEventHandler = null;
let _originOnUnhandledRejectionHandler = null;

export function ErrorPlugin(): Plugin {
  return {
    name: "error",
    register: ({ report, breadcrumb }) => {
      // onerror
      _originOnErrorHandler = window.onerror;
      window.onerror = function (
        msg: any,
        url: any,
        line: any,
        column: any,
        error: any
      ): boolean {
        onErrorHandler({ column, error, line, msg, url }, report);
        if (_originOnErrorHandler) {
          return _originOnErrorHandler.apply(this, arguments);
        }
        // https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror
        // 返回 true，阻止执行默认事件处理函数
        return false;
      };

      // unhandledrejection
      _originOnUnhandledRejectionHandler = window.onunhandledrejection;
      window.onunhandledrejection = function (e: any): boolean {
        unhandledRejectionHandler(e, report);
        if (_originOnUnhandledRejectionHandler) {
          return _originOnUnhandledRejectionHandler.apply(this, arguments);
        }
        return true;
      };
    },
    unregister(): void {
      window.onerror = _originOnErrorHandler;
      window.onunhandledrejection = _originOnUnhandledRejectionHandler;
    }
  };
}

function onErrorHandler(e, report: PluginReport) {
  if (e && e.error && isError(e.error)) {
    const result = computeStackTrace(e.error);
    const ex = exceptionFromStacktrace(result);

    const agg = {
      message: e.error?.message,
      stack: e.error?.stack
    };

    report({
      type: constant.ERROR,
      subtype: constant.ERROR_LISTENER,
      [constant.ERROR]: {
        values: ex.values
      },
      agg: createSummary(JSON.stringify(agg), 300)
    });
  }
}

function unhandledRejectionHandler(e, report: PluginReport) {
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

    const agg = {
      reason: err,
      message: err?.message,
      stack: err?.stack
    };

    report({
      type: constant.ERROR,
      subtype: constant.ERROR_UNHANDLEDREJECTION,
      [constant.ERROR]: {
        values: ex.values,
        rejection: true
      },
      agg: createSummary(JSON.stringify(agg), 300)
    });
  }
}
