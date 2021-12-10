# @doras/browser

## install

```shell
npm i @doras/browser
```

## usage

```ts
import { Browser } from "@doras/browser";

const instance = Browser({
  serverUrl: "http://127.0.0.1:8221/api/report",
  appKey: "449928675a854804849ad525be1fa77c",
  appEnv: "dev",
  appVersion: "0.0.1",
});

// 开启
instance.start()

// 关闭
instance.stop()
```

## issues

https://github.com/dora-projects/dora/issues
