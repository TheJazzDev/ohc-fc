import { test, expect } from "bun:test";
import { findDuplicatePlayer, isBenchOverfilled, isStartingXiComplete } from "./fixture";

test("findDuplicatePlayer returns null when every id is unique", () => {
  expect(findDuplicatePlayer(["a", "b", "c"])).toBeNull();
});

test("findDuplicatePlayer returns the id used in two slots", () => {
  expect(findDuplicatePlayer(["a", "b", "a"])).toBe("a");
});

test("findDuplicatePlayer ignores empty slot values", () => {
  expect(findDuplicatePlayer(["", "", "a"])).toBeNull();
});

test("isBenchOverfilled is false at the seven-player cap", () => {
  expect(isBenchOverfilled(["a", "b", "c", "d", "e", "f", "g"])).toBe(false);
});

test("isBenchOverfilled is true past the seven-player cap", () => {
  expect(isBenchOverfilled(["a", "b", "c", "d", "e", "f", "g", "h"])).toBe(true);
});

test("isStartingXiComplete requires all eleven slots filled", () => {
  const full = Array.from({ length: 11 }, (_, i) => `p${i}`);
  expect(isStartingXiComplete(full)).toBe(true);
});

test("isStartingXiComplete is false with a missing slot", () => {
  const missingOne = Array.from({ length: 11 }, (_, i) => (i === 5 ? undefined : `p${i}`));
  expect(isStartingXiComplete(missingOne)).toBe(false);
});

test("isStartingXiComplete is false with fewer than eleven slots", () => {
  expect(isStartingXiComplete(["a", "b"])).toBe(false);
});
