
// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  collectCoverageFrom: ["packages/**/src/**/*.ts"],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ["/node_modules/"],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",
  runner: "jest-electron/runner",
  testEnvironment: "jest-electron/environment",

  // The glob patterns Jest uses to detect test files
  transform: {
    "\\.(ts)$": "<rootDir>/tools/jest/jest.transform.ts.js"
    // "\\.(ts)$": "babel-jest"
  },
  testMatch: [
    //   "**/__tests__/**/*.[jt]s?(x)",
    //   "**/?(*.)+(spec|test).[tj]s?(x)"
    "**/?(*.)+(spec|test).ts"
  ],

};
