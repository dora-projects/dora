import React from "react";
import { Browser } from "@doras/browser";

function Stat() {
  const handleStat = () => {
    Browser.stat({
      statAction: "click",
      statCategory: "2020",
      statLabel: "test",
      statValue: 11
    });
  };

  return (
    <div className="section">
      <h1>Stat</h1>
      <button
        onClick={() => {
          handleStat();
        }}
      >
        自定义打点
      </button>
    </div>
  );
}

export default Stat;
