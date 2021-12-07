import { Dora, ErrorPlugin } from "@doras/browser";

const dora =new Dora({
  serverUrl: "/collect",
  appId: "44992867-5a85-4804-849a-d525be1fa77c",
  appVersion: "0.0.1",
  appEnv: "dev",
  debug: false,
})

dora.start()
