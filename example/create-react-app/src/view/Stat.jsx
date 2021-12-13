import React from "react";

function Stat() {
  const [active, setActive] = React.useState("click");
  const [category, setCategory] = React.useState("activity");
  const [label, setLabel] = React.useState("banner");
  const [val, setValue] = React.useState(11);

  const handleStat = () => {
    // Browser.stat({
    //   action: active,
    //   category: category,
    //   label: label,
    //   value: val
    // });
  };

  return (
    <div className="section bg-white shadow-md">
      <h1>Stat</h1>
      <input
        className="mb-3.5"
        type="text"
        value={active}
        placeholder="statAction"
        onChange={(v) => {
          setActive(v.target.value);
        }}
      />
      <input
        className="mb-3.5"
        type="text"
        value={category}
        placeholder="setCategory"
        onChange={(v) => {
          setCategory(v.target.value);
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
