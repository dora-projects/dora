import { DeviceField, PageField, Plugin } from "@doras/core";

export const DevicePlugin = (conf?): Plugin => {
  return {
    name: "@doras/browser-device-plugin",
    setup: ({ report }) => {},
    onEventBeforeSend: (event) => {
      const { type } = event;
      if (["performance", "stat"].includes(type)) return event;

      const deviceInfo: DeviceField = {
        screen: getScreen(),
        viewport: getViewPort(),
        ua: getUA()
      };
      const pageInfo: PageField = {
        title: document.title,
        href: window.location.href
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
