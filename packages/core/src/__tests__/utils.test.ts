import { isEmptyObject, isString } from "../utils";

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
