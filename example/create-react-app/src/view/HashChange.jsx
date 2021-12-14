import React from "react";

function HashChange() {
  return (
    <div className="section bg-white shadow-md">
      <h1>HashChange</h1>
      <div>
        <a href="/#app" className="text-blue-600 visited:text-purple-600">hash:/#app</a>
      </div>
      <div>
        <a href="/#dd" className="text-blue-600 visited:text-purple-600">hash: /#dd</a>
      </div>
    </div>
  );
}

export default HashChange;
