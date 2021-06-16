import React, { useState } from "react";
import Ajax from "./Ajax";
import Error from "./Error";
import HashChange from "./HashChange";
import History from "./History";

function App() {
  return (
    <div className="App">
      <Error />
      <Ajax />
      <HashChange />
      <History />
    </div>
  );
}

export default App;
