import Dora, { WebVitalsPlugin, ErrorPlugin } from "@doras/browser";

Dora.init({
  appId: "",
  appVersion: "",
  plugins: [WebVitalsPlugin(), ErrorPlugin()]
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
