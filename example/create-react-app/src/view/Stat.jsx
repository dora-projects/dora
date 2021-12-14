import React from "react";
import dora from "../lib/dora";


function Stat() {
  const [ category, setCategory ] = React.useState("click");
  const [ label, setLabel ] = React.useState("price");
  const [ number, setNumber ] = React.useState(10);

  const handleStat = () => {
    dora.stat({
      category: category,
      label: label,
      numberValue: number
    });
  };

  return (
    <div className="section bg-white shadow-md">
      <h1>Stat</h1>
      <input
        className="mb-3.5"
        type="text"
        value={category}
        placeholder="category"
        onChange={(v) => {
          setCategory(v.target.value);
        }}
      />
      <input
        className="mb-3.5"
        type="text"
        value={label}
        placeholder="label"
        onChange={(v) => {
          setLabel(v.target.value);
        }}
      />
      <input
        className="mb-3.5"
        type="number"
        value={number}
        placeholder="numberValue"
        onChange={(v) => {
          setNumber(v.target.value);
        }}
      />
      <button
        className="block"
        onClick={() => {
          handleStat();
        }}
      >
        自定义打点
      </button>
    </div>
  );
}

export default Stat;
