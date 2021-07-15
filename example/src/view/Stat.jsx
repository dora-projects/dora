import React from "react";
import { Browser } from "@doras/browser";

function Stat() {
  const [active, setActive] = React.useState("click");
  const [category, setCategory] = React.useState("activity");
  const [label, setLabel] = React.useState("banner");
  const [val, setValue] = React.useState(11);

  const handleStat = () => {
    Browser.stat({
      statAction: active,
      statCategory: category,
      statLabel: label,
      statValue: val
    });
  };

  return (
    <div className="section">
      <h1>Stat</h1>
      <input
        type="text"
        value={active}
        placeholder="statAction"
        onChange={(v) => {
          setActive(v.target.value);
        }}
      />
      <input
        type="text"
        value={category}
        placeholder="setCategory"
        onChange={(v) => {
          setCategory(v.target.value);
        }}
      />
      <input
        type="text"
        value={label}
        placeholder="setLabel"
        onChange={(v) => {
          setLabel(v.target.value);
        }}
      />
      <input
        type="text"
        value={val}
        placeholder="setValue"
        onChange={(v) => {
          setValue(v.target.value);
        }}
      />

      <button
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
