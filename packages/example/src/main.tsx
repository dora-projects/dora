import Dora, { WebVitalsPlugin, ErrorPlugin } from "@doras/browser";

Dora.init({
  appEnv: "",
  serverUrl: "",
  appId: "",
  appVersion: ""
});

import React from "react";
import ReactDOM from "react-dom";
import App from "./view/App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
