import { BrowserClient } from "@doras/browser";
import config from "../lib/default"

const dora = new BrowserClient({
  // debug: true,
  // serverUrl: "http://localhost:8000/report",
  // appKey: "636005f05d574ca7b920b2e01c241985",
  // appVersion: "0.0.1",
  // appEnv: "dev",
  ...config,
  beforeSend(e){
    console.log(JSON.stringify(e,null,2))
    return e
  }
});

dora.start();
