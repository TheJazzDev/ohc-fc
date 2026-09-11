import { test, expect } from "bun:test";
import { formationSlots } from "./formations";
import { remapSlotsToFormation } from "./remap-formation";

// Slot index -> a stand-in player id, so we can follow where each pick lands.
function pickAll(formation: string) {
  return formationSlots(formation).map((slot, index) => `${slot.label}-${index}`);
}

function labelOf(formation: string, slots: string[], playerId: string) {
  const index = slots.indexOf(playerId);
  return index === -1 ? null : formationSlots(formation)[index].label;
}

test("carries every pick across a formation change instead of clearing them", () => {
  const before = pickAll("4-3-3");
  const after = remapSlotsToFormation("4-3-3", "4-4-2", before);

  expect(after).toHaveLength(11);
  expect(after.filter(Boolean)).toHaveLength(11);
  expect(new Set(after)).toEqual(new Set(before));
});

test("keeps players in the same-labelled slot when the new shape has one", () => {
  const before = pickAll("4-3-3");
  const after = remapSlotsToFormation("4-3-3", "4-4-2", before);

  for (const label of ["GK", "LB", "RB"]) {
    const playerId = before[formationSlots("4-3-3").findIndex((slot) => slot.label === label)];
    expect(labelOf("4-4-2", after, playerId)).toBe(label);
  }
});

test("moves wingers into the nearest wide slot of the new shape", () => {
  const before = pickAll("4-3-3");
  const after = remapSlotsToFormation("4-3-3", "4-4-2", before);
  const shape = formationSlots("4-3-3");

  const leftWinger = before[shape.findIndex((slot) => slot.label === "LW")];
  const rightWinger = before[shape.findIndex((slot) => slot.label === "RW")];
  expect(labelOf("4-4-2", after, leftWinger)).toBe("LM");
  expect(labelOf("4-4-2", after, rightWinger)).toBe("RM");
});

test("keeps left-sided players on the left when the back line changes size", () => {
  const before = pickAll("4-3-3");
  const after = remapSlotsToFormation("4-3-3", "3-5-2", before);
  const shape = formationSlots("4-3-3");

  const leftBack = before[shape.findIndex((slot) => slot.label === "LB")];
  const rightBack = before[shape.findIndex((slot) => slot.label === "RB")];
  expect(labelOf("3-5-2", after, leftBack)).toBe("LWB");
  expect(labelOf("3-5-2", after, rightBack)).toBe("RWB");
});

test("leaves empty slots empty rather than inventing picks", () => {
  const before = formationSlots("4-3-3").map(() => "");
  before[0] = "keeper";
  const after = remapSlotsToFormation("4-3-3", "4-2-3-1", before);

  expect(after.filter(Boolean)).toEqual(["keeper"]);
  expect(after[0]).toBe("keeper");
});

test("never places the same player in two slots", () => {
  for (const target of ["4-4-2", "4-2-3-1", "3-4-3", "5-3-2", "4-2-4"]) {
    const after = remapSlotsToFormation("4-3-3", target, pickAll("4-3-3"));
    expect(new Set(after).size).toBe(after.length);
  }
});

test("is a no-op when the formation does not actually change", () => {
  const before = pickAll("4-3-3");
  expect(remapSlotsToFormation("4-3-3", "4-3-3", before)).toEqual(before);
});
