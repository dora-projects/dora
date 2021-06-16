import { DeviceField, PageField, Plugin } from "@doras/core";

export const DevicePlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-device-plugin",
    setup: ({ report }) => {},
    onEventBeforeSend: (event) => {
      const deviceInfo: DeviceField = {
        devScreen: getScreen(),
        devViewport: getViewPort(),
        devUa: getUA()
      };
      const pageInfo: PageField = {
        pageTitle: document.title,
        pageLocation: window.location.href
      };
      return { ...event, ...deviceInfo, ...pageInfo };
    }
  };
};

function getViewPort(): string {
  const w =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const h =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  return `${w}x${h}`;
}

function getScreen(): string {
  const w = window.screen.width;
  const h = window.screen.height;
  return `${w}x${h}`;
}

function getUA(): string {
  return window.navigator?.userAgent;
}
