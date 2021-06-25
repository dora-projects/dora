import React from "react";

function PromiseError() {
  const handlePromise = () => {
    Promise?.reject(new Error("fail"));
  };
  return (
    <div className="section">
      <h1>Promise</h1>
      <button onClick={() => handlePromise()}>unhandledrejection 按钮</button>
    </div>
  );
}

export default PromiseError;
