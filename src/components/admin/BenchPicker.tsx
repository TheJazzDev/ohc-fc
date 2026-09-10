import type { PlayerOption } from "./LineupSlotRow";

const BENCH_MAX = 7;

export function BenchPicker({
  players,
  selected,
  onToggle,
}: {
  players: PlayerOption[];
  selected: string[];
  onToggle: (playerId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-heading text-xs font-bold tracking-wide uppercase">Bench</span>
        <span className="text-xs text-muted">
          {selected.length}/{BENCH_MAX}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {players.map((player) => (
          <label key={player.id} className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="bench"
              value={player.id}
              checked={selected.includes(player.id)}
              onChange={() => onToggle(player.id)}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            #{player.number} · {player.name}
            <span className="text-xs text-muted uppercase">{player.position}</span>
          </label>
        ))}
        {players.length === 0 && <p className="text-sm text-muted">No other players available for the bench.</p>}
      </div>
    </div>
  );
}
