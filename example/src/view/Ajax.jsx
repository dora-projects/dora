import React from "react";

function Ajax() {
  const handleError = () => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      }
    };
    xmlhttp.open("GET", "https://api.nancode.cn/http/error?status=511", true);
    xmlhttp.send(JSON.stringify({ a: 123 }));
  };

  const handleTimeOut = () => {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      }
    };
    xmlhttp.timeout = 3000;
    xmlhttp.open("GET", "https://api.nancode.cn/http/delay?delay=5", true);
    xmlhttp.send(JSON.stringify({ a: 1, b: "i am data" }));
  };

  return (
    <div className="section">
      <h1>ajax</h1>
      <button onClick={() => handleError()}>500按钮</button>
      <button onClick={() => handleTimeOut()}>timeout 按钮</button>
    </div>
  );
}

export default Ajax;
