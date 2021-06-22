import React, { useState } from "react";
import Dora from "@doras/browser";
import Ajax from "./Ajax";
import Error from "./Error";
import HashChange from "./HashChange";
import History from "./History";

function App() {
  React.useEffect(() => {
    Dora.setUser("12312312312", { userName: "王小明", age: 18 });
  }, []);

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
