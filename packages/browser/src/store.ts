import { Store } from "@doras/core";
import { uuid, safeJsonParse } from "@doras/shared";

const DATA_STORE_KEY = "_dora_data";

export class BrowserStore extends Store {
  save(data): boolean {
    const originDataString = localStorage.getItem(DATA_STORE_KEY);
    if (originDataString) {
      const originData = safeJsonParse(originDataString);
      if (Array.isArray(originData)) {
        originData.push(data);
        localStorage.setItem(DATA_STORE_KEY, JSON.stringify(originData));
        return true;
      }
    } else {
      localStorage.setItem(DATA_STORE_KEY, JSON.stringify([data]));
      return true;
    }
  }

  get() {
    const originDataString = localStorage.getItem(DATA_STORE_KEY);
    if (originDataString) {
      return safeJsonParse(originDataString);
    }
  }

  remove(): void {
    localStorage.removeItem(DATA_STORE_KEY);
  }

  getAnonymousId(): string {
    const uid_key = "_dora_uid";
    const uid = localStorage?.getItem(uid_key);
    if (uid && uid != "") return uid;
    const newUid = uuid();
    localStorage?.setItem(uid_key, newUid);
    return newUid;
  }

  getSessionId(): string {
    const uid_key = "_dora_sid";
    const uid = sessionStorage?.getItem(uid_key);
    if (uid && uid != "") return uid;
    const newUid = uuid();
    sessionStorage?.setItem(uid_key, newUid);
    return newUid;
  }
}
