import React from "react";
import ReactDOM from "react-dom";
import App from "./view/App";

import Dora from "@doras/core";
import { LogPlugin, ErrorPlugin } from "@doras/browser";

Dora.init({
  plugins: [LogPlugin({}), ErrorPlugin()]
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
