import { Store } from "@doras/core";
import { createUUID } from "@doras/shared";

export class BrowserStore extends Store {
  push(data): void {}

  get() {
    return null;
  }

  remove(): void {}

  getAnonymousId(): string {
    const uid_key = "_dora_uid";
    const uid = localStorage?.getItem(uid_key);
    if (uid && uid != "") return uid;
    const newUid = createUUID();
    localStorage?.setItem(uid_key, newUid);
    return newUid;
  }
  getSessionId(): string {
    const uid_key = "_dora_sid";
    const uid = sessionStorage?.getItem(uid_key);
    if (uid && uid != "") return uid;
    const newUid = createUUID();
    sessionStorage?.setItem(uid_key, newUid);
    return newUid;
  }
}
