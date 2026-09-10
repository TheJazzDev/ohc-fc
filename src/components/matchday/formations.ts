import type { Position } from "@/components/squad/types";

export type Formation = "4-3-3" | "4-4-2" | "3-5-2";

export const FORMATION_OPTIONS: Formation[] = ["4-3-3", "4-4-2", "3-5-2"];

export type FormationSlot = { label: string; position: Position; x: number; y: number };

const FORMATIONS: Record<Formation, FormationSlot[]> = {
  "4-3-3": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 28 },
    { label: "CB", position: "CB", x: 38, y: 23 },
    { label: "CB", position: "CB", x: 62, y: 23 },
    { label: "RB", position: "FB", x: 85, y: 28 },
    { label: "CDM", position: "DM", x: 50, y: 45 },
    { label: "CM", position: "CM", x: 26, y: 55 },
    { label: "CM", position: "CM", x: 74, y: 55 },
    { label: "LW", position: "W", x: 18, y: 78 },
    { label: "ST", position: "ST", x: 50, y: 85 },
    { label: "RW", position: "W", x: 82, y: 78 },
  ],
  "4-4-2": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 28 },
    { label: "CB", position: "CB", x: 38, y: 23 },
    { label: "CB", position: "CB", x: 62, y: 23 },
    { label: "RB", position: "FB", x: 85, y: 28 },
    { label: "LM", position: "W", x: 20, y: 52 },
    { label: "CM", position: "CM", x: 40, y: 48 },
    { label: "CM", position: "CM", x: 60, y: 48 },
    { label: "RM", position: "W", x: 80, y: 52 },
    { label: "ST", position: "ST", x: 38, y: 82 },
    { label: "ST", position: "ST", x: 62, y: 82 },
  ],
  "3-5-2": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "CB", position: "CB", x: 25, y: 26 },
    { label: "CB", position: "CB", x: 50, y: 21 },
    { label: "CB", position: "CB", x: 75, y: 26 },
    { label: "LWB", position: "FB", x: 10, y: 52 },
    { label: "CM", position: "DM", x: 32, y: 46 },
    { label: "CM", position: "CM", x: 50, y: 58 },
    { label: "CM", position: "DM", x: 68, y: 46 },
    { label: "RWB", position: "FB", x: 90, y: 52 },
    { label: "ST", position: "ST", x: 38, y: 82 },
    { label: "ST", position: "ST", x: 62, y: 82 },
  ],
};

export function isFormation(value: string): value is Formation {
  return value in FORMATIONS;
}

export function formationSlots(formation: string): FormationSlot[] {
  return FORMATIONS[isFormation(formation) ? formation : "4-3-3"];
}
