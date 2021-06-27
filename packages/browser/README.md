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
  appEnv: "dev",
  serverUrl: "https://api.demo.cn/amp",
  appId: "wdssfar2312312dsad",
  appVersion: "0.0.1",
  debug: false
});

// 设置业务 user id
Browser.setUser("52467", { userName: "王小明", age: 18 });

// 主动捕获
Browser.catchException("test msg", new Error("error test"));

// 自定义打点统计
Browser.stat({
  statAction: "click",
  statCategory: "2020",
  statLabel: "test",
  statValue: 11
});

```
## server
服务端代码


## issues

https://github.com/nanzm/dora/issues
