import { Transport } from "@doras/core";

export const BrowserTransport: Transport = (
  mode: string,
  url: string,
  data
) => {
  return new Promise((resolve, reject) => {
    if (mode === "sendBeacon" && navigator.sendBeacon) {
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
};
