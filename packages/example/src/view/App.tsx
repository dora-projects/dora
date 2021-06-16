import React, { useState } from "react";
import Ajax from "./Ajax";
import Error from "./Error";

function App() {
  return (
    <div className="App">
      <Error />
      <Ajax />
    </div>
  );
}

export default App;
