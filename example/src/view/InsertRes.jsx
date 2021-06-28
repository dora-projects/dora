import React from "react"

export default function InsertRes() {
  const handle = () => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://unpkg.com/lodash@4.17.21/lodash.js";
    head.appendChild(script);
  }

  return (
    <div className="section">
      <h1>InsertRes</h1>
      <button onClick={() => handle()}>插入 script</button>
    </div>
  )
}
