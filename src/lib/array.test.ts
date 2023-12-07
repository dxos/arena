// FILEPATH: /Users/zaymonfoulds-cook/Projects/arena-app/src/lib/array.test.ts
import { test, expect } from "vitest";
import { arrayToPairs } from "./array";

test("returns empty array when input is empty", () => {
  expect(arrayToPairs([])).toEqual([]);
});

test("returns a single-element pair for a single-element array", () => {
  expect(arrayToPairs([1])).toEqual([[1]]);
});

test("returns pairs of elements for even-sized array", () => {
  expect(arrayToPairs([1, 2, 3, 4])).toEqual([
    [1, 2],
    [3, 4],
  ]);
});

test("returns pairs of elements and a single-element pair for odd-sized array", () => {
  expect(arrayToPairs([1, 2, 3])).toEqual([[1, 2], [3]]);
});

test("works with arrays of strings", () => {
  expect(arrayToPairs(["a", "b", "c", "d"])).toEqual([
    ["a", "b"],
    ["c", "d"],
  ]);
});

test("works with mixed type arrays", () => {
  expect(arrayToPairs(["a", 1, "b", 2])).toEqual([
    ["a", 1],
    ["b", 2],
  ]);
});
