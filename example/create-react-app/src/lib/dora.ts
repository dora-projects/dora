import { BrowserClient } from "@doras/browser";

const dora = new BrowserClient({
  debug: true,
  serverUrl: "/collect",
  appKey: "44992867-5a85-4804-849a-d525be1fa77c",
  appVersion: "0.0.1",
  appEnv: "dev",
});

dora.start();
