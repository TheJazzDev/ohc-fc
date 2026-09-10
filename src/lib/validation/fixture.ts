const STARTER_SLOT_COUNT = 11;
const BENCH_MAX = 7;

export function findDuplicatePlayer(playerIds: string[]): string | null {
  const seen = new Set<string>();
  for (const id of playerIds) {
    if (!id) continue;
    if (seen.has(id)) return id;
    seen.add(id);
  }
  return null;
}

export function isBenchOverfilled(benchIds: string[]): boolean {
  return benchIds.length > BENCH_MAX;
}

export function isStartingXiComplete(starterIds: (string | undefined)[]): boolean {
  return starterIds.length === STARTER_SLOT_COUNT && starterIds.every((id) => !!id);
}
