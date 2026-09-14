import { test, expect } from "bun:test";
import { isNumberTaken } from "./player";

test("returns false when no player has the number", () => {
  const players = [{ id: "p1", number: 9, active: true }];
  expect(isNumberTaken(players, 10)).toBe(false);
});

test("returns true when another player has the number", () => {
  const players = [{ id: "p1", number: 9, active: true }];
  expect(isNumberTaken(players, 9)).toBe(true);
});

test("returns false when the only holder is the excluded player (editing self)", () => {
  const players = [{ id: "p1", number: 9, active: true }];
  expect(isNumberTaken(players, 9, "p1")).toBe(false);
});

test("returns false when the only holder has been removed from the squad", () => {
  const players = [{ id: "p1", number: 10, active: false }];
  expect(isNumberTaken(players, 10)).toBe(false);
});
