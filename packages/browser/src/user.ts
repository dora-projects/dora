import { createUUID } from "@doras/shared";

const uid_key = "dora_uid";

export function genUid(): string {
  const uid = localStorage.getItem(uid_key);
  if (uid && uid != "") return uid;

  // 重新创建
  const newUid = createUUID();
  localStorage.setItem(uid_key, newUid);
  return newUid;
}
