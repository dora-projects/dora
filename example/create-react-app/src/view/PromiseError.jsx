import React from "react";

function PromiseError() {
  const handlePromise = () => {
    Promise?.reject(new Error("fail"));
  };

  const handlePrimitive = () => {
    Promise?.reject("haha");
  };
  return (
    <div className="section bg-white shadow-md">
      <h1>Promise</h1>
      <button onClick={() => handlePromise()}>reject new Error 按钮</button>
      <button onClick={() => handlePrimitive()}>reject string 按钮</button>
    </div>
  );
}

export default PromiseError;
