import React from "react";
// import { Browser } from "@doras/browser";
import Config from "./view/Config";
import Ajax from "./view/Ajax";
import Error from "./view/Error";
import HashChange from "./view/HashChange";
import History from "./view/History";
import InsertRes from "./view/InsertRes";
import CustomReport from "./view/CustomReport";
import PromiseError from "./view/PromiseError";
import Stat from "./view/Stat";

function App() {
  React.useEffect(() => {
    // Browser.setUser("12312312312", { userName: "王小明", age: 18 });
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">
      <img src="https://nancode.gitee.io/dora/img/logo.png" alt="" style={{ display: "none" }} />
      <Config />
      <div className="section-groups">
        <Error />
        <Ajax />
        <HashChange />
        <History />
        <InsertRes />
        <CustomReport />
        <PromiseError />
        <Stat />
      </div>
    </div>
  );
}

export default App;
