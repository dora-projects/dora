# @doras/browser

## install

```shell
npm i @doras/browser
```

## usage

```ts
// 初始化
import Dora from "@doras/browser";

Dora.init({
  appEnv: "dev",
  serverUrl: "https://api.demo.cn/amp",
  appId: "wdssfar2312312dsad",
  appVersion: "0.0.1",
  debug: false
});

// 设置业务 user id
Dora.setUser("52467", { userName: "王小明", age: 18 });

// 自定义打点统计
Dora.stat({
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
