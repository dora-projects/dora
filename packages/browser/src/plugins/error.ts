export const ErrorPlugin = (conf?) => {
  return {
    name: "@doras/browser-error-plugin",
    init: ({ report }) => {
      const oldOnErrorHandler = window.onerror;
      window.onerror = function (msg, url, line, column, error) {
        report({ msg, url, line, column, error });
        if (oldOnErrorHandler) {
          return oldOnErrorHandler.apply(this, arguments);
        }
        return false;
      };
    },
    onEventBeforeSend: (event) => {
      return event;
    }
  };
};
