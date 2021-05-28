// custom-transformer.js
"use strict";

const babel = require("@babel/core");

module.exports = {
  process(code, filename) {
    const res = babel.transformSync(code, {
      filename: filename,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current"
            }
          }
        ],
        "@babel/preset-typescript"
      ]
    });
    return res.code;
  }
};
