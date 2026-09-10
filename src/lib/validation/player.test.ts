import { test, expect } from "bun:test";
import { isNumberTaken } from "./player";

test("returns false when no player has the number", () => {
  const players = [{ id: "p1", number: 9 }];
  expect(isNumberTaken(players, 10)).toBe(false);
});

test("returns true when another player has the number", () => {
  const players = [{ id: "p1", number: 9 }];
  expect(isNumberTaken(players, 9)).toBe(true);
});

test("returns false when the only holder is the excluded player (editing self)", () => {
  const players = [{ id: "p1", number: 9 }];
  expect(isNumberTaken(players, 9, "p1")).toBe(false);
});
