import React from "react";
import Dora from "@doras/browser";

function CustomReport() {
  const handleError = () => {
    try {
      throw new Error("test custom report");
    } catch (e) {
      Dora.catchException("呵呵哒", e);
    }
  };
  return (
    <div className="section">
      <h1>CustomReport</h1>
      <button onClick={() => handleError()}>undefined 按钮</button>
    </div>
  );
}

export default CustomReport;
