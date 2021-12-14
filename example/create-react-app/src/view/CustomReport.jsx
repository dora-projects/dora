import React from "react";
import dora from "../lib/dora";

function CustomReport() {
  const handleError = () => {
    try {
      throw new Error("test custom report");
    } catch (e) {
      dora.catchError(e);
    }
  };
  return (
    <div className="section bg-white shadow-md">
      <h1>CustomReport</h1>
      <button onClick={() => handleError()}>undefined 按钮</button>
    </div>
  );
}

export default CustomReport;
