export type PlayerNumberRecord = { id: string; number: number; active: boolean };

/**
 * Squad numbers only need to be unique among active players: a removed player
 * keeps their number for past lineups, but it is free for someone new.
 */
export function isNumberTaken(players: PlayerNumberRecord[], candidateNumber: number, excludePlayerId?: string): boolean {
  return players.some(
    (player) => player.active && player.number === candidateNumber && player.id !== excludePlayerId,
  );
}
