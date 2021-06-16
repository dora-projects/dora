export function createUUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  const s = [] as any;
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  const uuid = s.join("");
  return uuid;
}

const uid_key = "dora_uid";

export function genUid(): string {
  const uid = localStorage.getItem(uid_key);
  if (uid && uid != "") return uid;

  // 重新创建
  const newUid = createUUID();
  localStorage.setItem(uid_key, newUid);
  return newUid;
}
