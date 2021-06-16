import React, { useState } from "react";

function History() {
  const pushState = () => {
    window?.history.pushState(null, "", "/dd");
  };
  const replaceState = () => {
    window?.history.replaceState(null, "", "/zz");
  };

  return (
    <div className="section">
      <h1>History</h1>
      <button onClick={() => pushState()}>pushState 按钮</button>
      <button onClick={() => replaceState()}>replaceState 按钮</button>
    </div>
  );
}

export default History;
