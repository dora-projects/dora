import React from "react";

function Error() {
  const handleError = () => {
    const obj = JSON.parse("");
    console.log(obj.name.b.c);
  };
  return (
    <div className="section">
      <h1>Error</h1>
      <button onClick={() => handleError()}>undefined 按钮</button>
    </div>
  );
}

export default Error;
