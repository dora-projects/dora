import Dora from "@doras/core";
import { WebVitalsPlugin, ErrorPlugin } from "@doras/browser";

Dora.init({
  plugins: [WebVitalsPlugin({}), ErrorPlugin()]
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
