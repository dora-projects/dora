import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/App';



import Dora, { LogPlugin, ErrorPlugin } from "./lib/dora"

Dora.init({
  plugins: [ LogPlugin({}), ErrorPlugin() ]
})


ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root'),
);
