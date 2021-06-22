import Dora from "@doras/browser";

Dora.init({
  appEnv: "dev",
  serverUrl: "https://api.demo.cn/amp",
  appId: "wdssfar2312312dsad",
  appVersion: "0.0.1",
  debug: true
});

import React from "react";
import ReactDOM from "react-dom";
import App from "./view/App";
import "./g.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
