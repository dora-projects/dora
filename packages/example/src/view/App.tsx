import React, { useState } from "react";

function App() {
  return (
    <div className="App">
      <h1>hello world</h1>
      <button
        onClick={() => {
          const obj = JSON.parse("");
          console.log(obj.name.b.c);
        }}
      >
        按钮
      </button>
    </div>
  );
}

export default App;
