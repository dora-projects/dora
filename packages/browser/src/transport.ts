import { Transport } from "@doras/core";
import { TransportOptions } from "@doras/types";
import { isFunction } from "@doras/shared";

export class BrowserTransport extends Transport {
  constructor(config: TransportOptions) {
    super(config);
  }

  send(e) {
    let event = e;

    if (isFunction(this.beforeSendHook)) {
      const data = this.beforeSendHook(e);
      if (!data) return;
      event = data;
    }

    const url = this.url;
    return new Promise((resolve, reject) => {
      if (navigator.sendBeacon) {
        const json = JSON.stringify(event);
        const result = navigator.sendBeacon(url, json);
        resolve(result);
      } else {
        const json = JSON.stringify(event);
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
              return resolve(xhr.response);
            }
            reject(xhr);
          }
        };
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(json);
      }
    });
  }
}
