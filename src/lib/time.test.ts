import { ms } from "./time";
import { test, expect } from "vitest";

test("ms function", () => {
  expect(ms({ minutes: 1 })).toBe(60000);
  expect(ms({ hours: 1 })).toBe(3600000);
  expect(ms({ seconds: 1 })).toBe(1000);
  expect(ms({ hours: 1, minutes: 1, seconds: 1 })).toBe(3661000);
});
