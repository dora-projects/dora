import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";

import "./lib/dora";
// import "./lib/perfume"

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "./style.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
