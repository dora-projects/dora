import { Browser } from "@doras/browser";

Browser.init({
  appEnv: "dev",
  serverUrl: "https://api.demo.cn/amp",
  appId: "wdssfar2312312dsad",
  appVersion: "0.0.1",
  debug: false
});

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "./g.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
