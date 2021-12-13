import React from "react";

function RandomID(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

function Error() {
  const handleError = () => {
    // const obj = JSON.parse("");
    // console.log(obj.name.b.c);
    let a = {
      b: null
    };
    console.log(a.b.c);
  };

  const handleRandomError = () => {
    let user = {};
    user.detail[RandomID(10)];
  };

  return (
    <div className="section bg-white shadow-md">
      <h1>Error</h1>
      <button onClick={() => handleError()}>undefined 按钮</button>
      <button onClick={() => handleRandomError()}>RandomError 按钮</button>
    </div>
  );
}

export default Error;
