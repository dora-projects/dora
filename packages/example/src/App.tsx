import React from "react";
import Dora from "@doras/browser";
import Ajax from "./view/Ajax";
import Error from "./view/Error";
import HashChange from "./view/HashChange";
import History from "./view/History";
import CustomReport from "./view/CustomReport";
import PromiseError from "./view/PromiseError";

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
      <CustomReport />
      <PromiseError />
    </div>
  );
}

export default App;
