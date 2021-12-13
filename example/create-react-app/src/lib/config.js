const key = "dora-example-config";

export function setConfig(config) {
  localStorage.setItem(key, JSON.stringify(config));
}

export function getConfig() {
  const configString = localStorage.getItem(key);
  try {
    return JSON.parse(configString);
  } catch (e) {
    return {};
  }
}

export function remove() {
  localStorage.removeItem(key);
}
