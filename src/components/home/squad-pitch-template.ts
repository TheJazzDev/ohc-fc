export type PitchSlotPosition = "GK" | "DF" | "MF" | "FW";

type TemplateEntry = [PitchSlotPosition, number, number];

// Generic 4-3-3 shape: [position, x-across 0-100, y-depth 0-100 from own goal].
// Not tied to a real match lineup — used to preview how the squad is filling out.
const TEMPLATE: TemplateEntry[] = [
  ["GK", 50, 6],
  ["DF", 15, 28],
  ["DF", 38, 23],
  ["DF", 62, 23],
  ["DF", 85, 28],
  ["MF", 50, 45],
  ["MF", 26, 55],
  ["MF", 74, 55],
  ["FW", 18, 78],
  ["FW", 50, 85],
  ["FW", 82, 78],
];

export type PitchSlot = { position: PitchSlotPosition; left: number; top: number };

export const SQUAD_PITCH_SLOTS: PitchSlot[] = TEMPLATE.map(([position, x, y]) => ({
  position,
  left: x,
  top: 100 - y,
}));
