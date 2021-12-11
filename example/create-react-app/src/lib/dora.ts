import { BrowserClient, ErrorPlugin } from "@doras/browser";

const dora = new BrowserClient({
  debug: true,
  serverUrl: "http://localhost:8000/report",
  appKey: "636005f05d574ca7b920b2e01c241985",
  appVersion: "0.0.1",
  appEnv: "dev",
});

dora.start();
