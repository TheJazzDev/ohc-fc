import type { Position } from "@/components/squad/types";

export type Formation =
  | "4-3-3"
  | "4-4-2"
  | "4-2-3-1"
  | "4-3-2-1"
  | "4-1-4-1"
  | "4-5-1"
  | "4-1-2-1-2"
  | "4-2-2-2"
  | "4-1-3-2"
  | "4-2-4"
  | "3-5-2"
  | "3-4-3"
  | "3-4-2-1"
  | "5-3-2"
  | "5-4-1";

export const FORMATION_OPTIONS: Formation[] = [
  "4-3-3",
  "4-4-2",
  "4-2-3-1",
  "4-3-2-1",
  "4-1-4-1",
  "4-5-1",
  "4-1-2-1-2",
  "4-2-2-2",
  "4-1-3-2",
  "4-2-4",
  "3-5-2",
  "3-4-3",
  "3-4-2-1",
  "5-3-2",
  "5-4-1",
];

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
  "4-2-3-1": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 26 },
    { label: "CB", position: "CB", x: 38, y: 22 },
    { label: "CB", position: "CB", x: 62, y: 22 },
    { label: "RB", position: "FB", x: 85, y: 26 },
    { label: "CDM", position: "DM", x: 38, y: 42 },
    { label: "CDM", position: "DM", x: 62, y: 42 },
    { label: "LW", position: "W", x: 18, y: 65 },
    { label: "CAM", position: "AM", x: 50, y: 62 },
    { label: "RW", position: "W", x: 82, y: 65 },
    { label: "ST", position: "ST", x: 50, y: 85 },
  ],
  "4-3-2-1": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 26 },
    { label: "CB", position: "CB", x: 38, y: 22 },
    { label: "CB", position: "CB", x: 62, y: 22 },
    { label: "RB", position: "FB", x: 85, y: 26 },
    { label: "CDM", position: "DM", x: 50, y: 40 },
    { label: "CM", position: "CM", x: 30, y: 50 },
    { label: "CM", position: "CM", x: 70, y: 50 },
    { label: "CAM", position: "AM", x: 35, y: 68 },
    { label: "CAM", position: "AM", x: 65, y: 68 },
    { label: "ST", position: "ST", x: 50, y: 86 },
  ],
  "4-1-4-1": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 26 },
    { label: "CB", position: "CB", x: 38, y: 22 },
    { label: "CB", position: "CB", x: 62, y: 22 },
    { label: "RB", position: "FB", x: 85, y: 26 },
    { label: "CDM", position: "DM", x: 50, y: 40 },
    { label: "LM", position: "W", x: 18, y: 55 },
    { label: "CM", position: "CM", x: 38, y: 52 },
    { label: "CM", position: "CM", x: 62, y: 52 },
    { label: "RM", position: "W", x: 82, y: 55 },
    { label: "ST", position: "ST", x: 50, y: 85 },
  ],
  "4-5-1": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 27 },
    { label: "CB", position: "CB", x: 38, y: 23 },
    { label: "CB", position: "CB", x: 62, y: 23 },
    { label: "RB", position: "FB", x: 85, y: 27 },
    { label: "LM", position: "W", x: 12, y: 54 },
    { label: "CM", position: "CM", x: 32, y: 52 },
    { label: "CDM", position: "DM", x: 50, y: 45 },
    { label: "CM", position: "CM", x: 68, y: 52 },
    { label: "RM", position: "W", x: 88, y: 54 },
    { label: "ST", position: "ST", x: 50, y: 86 },
  ],
  "4-1-2-1-2": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 27 },
    { label: "CB", position: "CB", x: 38, y: 23 },
    { label: "CB", position: "CB", x: 62, y: 23 },
    { label: "RB", position: "FB", x: 85, y: 27 },
    { label: "CDM", position: "DM", x: 50, y: 40 },
    { label: "CM", position: "CM", x: 32, y: 52 },
    { label: "CM", position: "CM", x: 68, y: 52 },
    { label: "CAM", position: "AM", x: 50, y: 65 },
    { label: "ST", position: "ST", x: 38, y: 84 },
    { label: "ST", position: "ST", x: 62, y: 84 },
  ],
  "4-2-2-2": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 27 },
    { label: "CB", position: "CB", x: 38, y: 23 },
    { label: "CB", position: "CB", x: 62, y: 23 },
    { label: "RB", position: "FB", x: 85, y: 27 },
    { label: "CDM", position: "DM", x: 38, y: 42 },
    { label: "CDM", position: "DM", x: 62, y: 42 },
    { label: "CAM", position: "AM", x: 30, y: 60 },
    { label: "CAM", position: "AM", x: 70, y: 60 },
    { label: "ST", position: "ST", x: 38, y: 84 },
    { label: "ST", position: "ST", x: 62, y: 84 },
  ],
  "4-1-3-2": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 27 },
    { label: "CB", position: "CB", x: 38, y: 23 },
    { label: "CB", position: "CB", x: 62, y: 23 },
    { label: "RB", position: "FB", x: 85, y: 27 },
    { label: "CDM", position: "DM", x: 50, y: 42 },
    { label: "CM", position: "CM", x: 25, y: 55 },
    { label: "CM", position: "CM", x: 50, y: 58 },
    { label: "CM", position: "CM", x: 75, y: 55 },
    { label: "ST", position: "ST", x: 38, y: 84 },
    { label: "ST", position: "ST", x: 62, y: 84 },
  ],
  "4-2-4": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LB", position: "FB", x: 15, y: 27 },
    { label: "CB", position: "CB", x: 38, y: 23 },
    { label: "CB", position: "CB", x: 62, y: 23 },
    { label: "RB", position: "FB", x: 85, y: 27 },
    { label: "CM", position: "CM", x: 38, y: 48 },
    { label: "CM", position: "CM", x: 62, y: 48 },
    { label: "LW", position: "W", x: 15, y: 80 },
    { label: "ST", position: "ST", x: 38, y: 86 },
    { label: "ST", position: "ST", x: 62, y: 86 },
    { label: "RW", position: "W", x: 85, y: 80 },
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
  "3-4-3": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "CB", position: "CB", x: 25, y: 26 },
    { label: "CB", position: "CB", x: 50, y: 22 },
    { label: "CB", position: "CB", x: 75, y: 26 },
    { label: "LM", position: "W", x: 10, y: 52 },
    { label: "CM", position: "CM", x: 35, y: 50 },
    { label: "CM", position: "CM", x: 65, y: 50 },
    { label: "RM", position: "W", x: 90, y: 52 },
    { label: "LW", position: "W", x: 18, y: 80 },
    { label: "ST", position: "ST", x: 50, y: 86 },
    { label: "RW", position: "W", x: 82, y: 80 },
  ],
  "3-4-2-1": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "CB", position: "CB", x: 25, y: 26 },
    { label: "CB", position: "CB", x: 50, y: 22 },
    { label: "CB", position: "CB", x: 75, y: 26 },
    { label: "LM", position: "W", x: 10, y: 50 },
    { label: "CM", position: "CM", x: 35, y: 48 },
    { label: "CM", position: "CM", x: 65, y: 48 },
    { label: "RM", position: "W", x: 90, y: 50 },
    { label: "CAM", position: "AM", x: 35, y: 66 },
    { label: "CAM", position: "AM", x: 65, y: 66 },
    { label: "ST", position: "ST", x: 50, y: 86 },
  ],
  "5-3-2": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LWB", position: "FB", x: 8, y: 32 },
    { label: "CB", position: "CB", x: 28, y: 24 },
    { label: "CB", position: "CB", x: 50, y: 20 },
    { label: "CB", position: "CB", x: 72, y: 24 },
    { label: "RWB", position: "FB", x: 92, y: 32 },
    { label: "CDM", position: "DM", x: 30, y: 48 },
    { label: "CM", position: "CM", x: 50, y: 55 },
    { label: "CDM", position: "DM", x: 70, y: 48 },
    { label: "ST", position: "ST", x: 38, y: 84 },
    { label: "ST", position: "ST", x: 62, y: 84 },
  ],
  "5-4-1": [
    { label: "GK", position: "GK", x: 50, y: 6 },
    { label: "LWB", position: "FB", x: 8, y: 32 },
    { label: "CB", position: "CB", x: 28, y: 24 },
    { label: "CB", position: "CB", x: 50, y: 20 },
    { label: "CB", position: "CB", x: 72, y: 24 },
    { label: "RWB", position: "FB", x: 92, y: 32 },
    { label: "LM", position: "W", x: 15, y: 54 },
    { label: "CM", position: "CM", x: 35, y: 50 },
    { label: "CM", position: "CM", x: 65, y: 50 },
    { label: "RM", position: "W", x: 85, y: 54 },
    { label: "ST", position: "ST", x: 50, y: 86 },
  ],
};

export function isFormation(value: string): value is Formation {
  return value in FORMATIONS;
}

export function formationSlots(formation: string): FormationSlot[] {
  return FORMATIONS[isFormation(formation) ? formation : "4-3-3"];
}

// Same slots, mapped onto a landscape pitch (goal-to-goal runs left-to-right
// instead of top-to-bottom) — swap the axes rather than re-deriving them.
export function formationSlotsLandscape(formation: string): (FormationSlot & { left: number; top: number })[] {
  return formationSlots(formation).map((slot) => ({ ...slot, left: slot.y, top: slot.x }));
}

export type LineGroup = { label: string; from: number; to: number };

const LINE_GROUPS: Record<Formation, LineGroup[]> = {
  "4-3-3": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Midfield three", from: 5, to: 8 },
    { label: "Front three", from: 8, to: 11 },
  ],
  "4-4-2": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Midfield four", from: 5, to: 9 },
    { label: "Front two", from: 9, to: 11 },
  ],
  "4-2-3-1": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Double pivot", from: 5, to: 7 },
    { label: "Attacking three", from: 7, to: 10 },
    { label: "Striker", from: 10, to: 11 },
  ],
  "4-3-2-1": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Midfield three", from: 5, to: 8 },
    { label: "Support two", from: 8, to: 10 },
    { label: "Striker", from: 10, to: 11 },
  ],
  "4-1-4-1": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Holding midfielder", from: 5, to: 6 },
    { label: "Midfield four", from: 6, to: 10 },
    { label: "Striker", from: 10, to: 11 },
  ],
  "4-5-1": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Midfield five", from: 5, to: 10 },
    { label: "Striker", from: 10, to: 11 },
  ],
  "4-1-2-1-2": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Holding midfielder", from: 5, to: 6 },
    { label: "Central midfield two", from: 6, to: 8 },
    { label: "Attacking midfielder", from: 8, to: 9 },
    { label: "Front two", from: 9, to: 11 },
  ],
  "4-2-2-2": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Double pivot", from: 5, to: 7 },
    { label: "Attacking two", from: 7, to: 9 },
    { label: "Front two", from: 9, to: 11 },
  ],
  "4-1-3-2": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Holding midfielder", from: 5, to: 6 },
    { label: "Midfield three", from: 6, to: 9 },
    { label: "Front two", from: 9, to: 11 },
  ],
  "4-2-4": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back four", from: 1, to: 5 },
    { label: "Midfield two", from: 5, to: 7 },
    { label: "Front four", from: 7, to: 11 },
  ],
  "3-5-2": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back three", from: 1, to: 4 },
    { label: "Midfield five", from: 4, to: 9 },
    { label: "Front two", from: 9, to: 11 },
  ],
  "3-4-3": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back three", from: 1, to: 4 },
    { label: "Midfield four", from: 4, to: 8 },
    { label: "Front three", from: 8, to: 11 },
  ],
  "3-4-2-1": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back three", from: 1, to: 4 },
    { label: "Midfield four", from: 4, to: 8 },
    { label: "Support two", from: 8, to: 10 },
    { label: "Striker", from: 10, to: 11 },
  ],
  "5-3-2": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back five", from: 1, to: 6 },
    { label: "Midfield three", from: 6, to: 9 },
    { label: "Front two", from: 9, to: 11 },
  ],
  "5-4-1": [
    { label: "Goalkeeper", from: 0, to: 1 },
    { label: "Back five", from: 1, to: 6 },
    { label: "Midfield four", from: 6, to: 10 },
    { label: "Striker", from: 10, to: 11 },
  ],
};

export function lineGroups(formation: string): LineGroup[] {
  return LINE_GROUPS[isFormation(formation) ? formation : "4-3-3"];
}
