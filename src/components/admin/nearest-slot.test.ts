import { test, expect } from "bun:test";
import { nearestSlot } from "./nearest-slot";

// A rough 4-3-3 in board percentages (left/top), portrait pitch.
const SLOTS = [
  { left: 50, top: 94 }, // GK
  { left: 15, top: 72 }, // LB
  { left: 38, top: 77 }, // CB
  { left: 62, top: 77 }, // CB
  { left: 85, top: 72 }, // RB
  { left: 50, top: 55 }, // CDM
  { left: 26, top: 45 }, // CM
  { left: 74, top: 45 }, // CM
  { left: 18, top: 22 }, // LW
  { left: 50, top: 15 }, // ST
  { left: 82, top: 22 }, // RW
];

const PORTRAIT = 68 / 105;

test("returns the slot under the pointer", () => {
  expect(nearestSlot({ left: 50, top: 94 }, SLOTS, PORTRAIT)).toBe(0);
  expect(nearestSlot({ left: 18, top: 22 }, SLOTS, PORTRAIT)).toBe(8);
});

test("snaps to the closest slot when dropped between two", () => {
  // Just left of centre, between the two centre-backs.
  expect(nearestSlot({ left: 44, top: 77 }, SLOTS, PORTRAIT)).toBe(2);
  expect(nearestSlot({ left: 56, top: 77 }, SLOTS, PORTRAIT)).toBe(3);
});

test("picks the left winger, not the striker, for a drop out on the left flank", () => {
  expect(nearestSlot({ left: 20, top: 25 }, SLOTS, PORTRAIT)).toBe(8);
});

test("corrects for the pitch aspect ratio rather than treating percent as square", () => {
  // 20% of the board's width is far less real distance than 20% of its height
  // on a portrait pitch, so the horizontally-offset slot should win.
  const pair = [
    { left: 70, top: 50 }, // 20% away horizontally
    { left: 50, top: 70 }, // 20% away vertically
  ];
  expect(nearestSlot({ left: 50, top: 50 }, pair, PORTRAIT)).toBe(0);
});

test("returns null when there are no slots", () => {
  expect(nearestSlot({ left: 50, top: 50 }, [], PORTRAIT)).toBeNull();
});

test("is stable on an exact tie, preferring the earlier slot", () => {
  const pair = [
    { left: 40, top: 50 },
    { left: 60, top: 50 },
  ];
  expect(nearestSlot({ left: 50, top: 50 }, pair, PORTRAIT)).toBe(0);
});
