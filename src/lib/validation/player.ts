export type PlayerNumberRecord = { id: string; number: number };

export function isNumberTaken(players: PlayerNumberRecord[], candidateNumber: number, excludePlayerId?: string): boolean {
  return players.some((player) => player.number === candidateNumber && player.id !== excludePlayerId);
}
