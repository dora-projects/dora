import React from "react";

function Config() {
  const [url, setUrl] = React.useState("");

  const handleSubmit = () => {};

  return (
    <>
      <div className="section">
        <h1>sdk 配置</h1>
        <div>
          <input type="text" />
        </div>
        <div>
          <input type="text" />
        </div>
        <div>
          <input type="text" />
        </div>
        {/*<div>*/}
        {/*  <input type="checkbox" />*/}
        {/*</div>*/}
        <div>
          <input type="text" />
        </div>
        <button onClick={() => handleSubmit()}>确定</button>
      </div>
      <hr />
    </>
  );
}

export default Config;
