import { Transport } from "@doras/core";

export class BrowserTransport extends Transport {
  beforeSend(e) {
    return e;
  }

  send(url: string, data: any) {
    return new Promise((resolve, reject) => {
      if (navigator.sendBeacon) {
        const json = JSON.stringify(data);
        const result = navigator.sendBeacon(url, json);
        resolve(result);
      } else {
        const json = JSON.stringify(data);
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
