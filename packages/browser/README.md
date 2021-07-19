# @doras/browser

## install

```shell
npm i @doras/browser
```

## usage

```ts
// 初始化
import { Browser } from "@doras/browser";

Browser.init({
  serverUrl: "http://127.0.0.1:8221/collect",
  appId: "44992867-5a85-4804-849a-d525be1fa77c",
  appVersion: "0.0.1",
  appEnv: "dev",
});

// 设置业务 user id
Browser.setUser("52467", { userName: "王小明", age: 18 });

// 主动捕获
Browser.catchException("test msg", new Error("error test"));

// 自定义打点统计
Browser.stat({
  category: "2020",
  action: "click",
  label: "test",
  value: 11
});
```

## issues

https://github.com/dora-projects/dora/issues
