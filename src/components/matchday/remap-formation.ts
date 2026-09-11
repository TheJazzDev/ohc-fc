import { formationSlots, type FormationSlot } from "./formations";

// Changing formation used to wipe every pick. Instead, carry each picked player
// into the slot of the new shape that best matches the one they were standing
// in — same role first, then the same area of the pitch.

type Zone = "GK" | "DEF" | "MID" | "FWD";

function zoneOf(slot: FormationSlot): Zone {
  if (slot.position === "GK") return "GK";
  if (slot.y < 36) return "DEF";
  if (slot.y < 70) return "MID";
  return "FWD";
}

// Higher is a better home for the player. The distance term only ever breaks
// ties inside a bracket (it maxes out around 12, below the smallest bonus), so
// an LB lands at LWB rather than at whichever centre-back is closest.
function affinity(from: FormationSlot, to: FormationSlot): number {
  const sameLabel = from.label === to.label ? 100 : 0;
  const samePosition = from.position === to.position ? 50 : 0;
  const sameZone = zoneOf(from) === zoneOf(to) ? 25 : 0;
  return sameLabel + samePosition + sameZone - Math.hypot(from.x - to.x, from.y - to.y) / 10;
}

/**
 * Re-seats the picks of `from` into the shape of `to`. Every picked player is
 * kept — empty slots stay empty, and nobody is placed twice. The result is
 * always the length of the new formation.
 */
export function remapSlotsToFormation(from: string, to: string, slots: string[]): string[] {
  const fromShape = formationSlots(from);
  const toShape = formationSlots(to);
  const next = toShape.map(() => "");

  const picks = fromShape
    .map((slot, index) => ({ slot, playerId: slots[index] ?? "" }))
    .filter((pick) => pick.playerId !== "");

  // Score every (new slot, picked player) pairing, then hand out the strongest
  // pairings first. Equal scores fall back to slot order, so the result is
  // stable for a given pair of formations.
  const pairings = toShape.flatMap((target, targetIndex) =>
    picks.map((pick, pickIndex) => ({ targetIndex, pickIndex, score: affinity(pick.slot, target) })),
  );
  pairings.sort((a, b) => b.score - a.score);

  const filledTargets = new Set<number>();
  const seatedPicks = new Set<number>();
  for (const { targetIndex, pickIndex } of pairings) {
    if (filledTargets.has(targetIndex) || seatedPicks.has(pickIndex)) continue;
    next[targetIndex] = picks[pickIndex].playerId;
    filledTargets.add(targetIndex);
    seatedPicks.add(pickIndex);
  }

  return next;
}
