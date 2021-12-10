import {
  isEmptyObject,
  isString,
  parseUrl,
  isPath,
  isContains,
  numFixed
} from "..";

it("should isEmptyObject work", function () {
  expect(isEmptyObject(null)).toEqual(true);
  expect(isEmptyObject({})).toEqual(true);
  expect(isEmptyObject(undefined)).toEqual(true);
  expect(isEmptyObject("")).toEqual(true);
  expect(isEmptyObject(0)).toEqual(true);
  expect(isEmptyObject([])).toEqual(true);
});

it("should isString work", function () {
  expect(isString("")).toEqual(true);
});

it("should isPath work", function () {
  expect(isPath("/")).toEqual(true);
  expect(isPath("/ab")).toEqual(true);
  expect(isPath("ab")).toEqual(false);
});

it("should parseUrl work", function () {
  expect(
    parseUrl(
      "https://gitee.com/dora-platform/dora-sdk-js/blob/master/src/utils/mixin.ts"
    )
  ).toEqual({
    host: "gitee.com",
    path: "/dora-platform/dora-sdk-js/blob/master/src/utils/mixin.ts",
    protocol: "https",
    relative: "/dora-platform/dora-sdk-js/blob/master/src/utils/mixin.ts"
  });
});

it("should isContains work", function () {
  expect(isContains({ a: 0 }, ["a"])).toEqual(true);
  expect(isContains({ a: 0 }, ["a", "b"])).toEqual(false);
});

it("should numFixed work", function () {
  expect(numFixed(0, 3)).toEqual(0);
  expect(numFixed(1.2222, 3)).toEqual(1.222);
});
