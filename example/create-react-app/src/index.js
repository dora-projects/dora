import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";

import "./lib/dora";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
