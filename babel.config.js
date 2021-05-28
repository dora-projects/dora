// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: ">0.3%, not dead"
      }
    ],
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3
      }
    ]
  ]
};
