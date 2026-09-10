import type { Position } from "@/components/squad/types";

export type PlayerOption = { id: string; number: number; name: string; position: Position };

export function LineupSlotRow({
  label,
  suggestedPosition,
  players,
  value,
  onChange,
}: {
  label: string;
  suggestedPosition: Position;
  players: PlayerOption[];
  value: string;
  onChange: (playerId: string) => void;
}) {
  const suggested = players.filter((player) => player.position === suggestedPosition);
  const rest = players.filter((player) => player.position !== suggestedPosition);

  return (
    <label className="grid grid-cols-[56px_1fr] items-center gap-3 text-sm">
      <span className="font-heading text-xs font-bold tracking-wide text-accent uppercase">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base"
      >
        <option value="">— Select player —</option>
        {suggested.length > 0 && (
          <optgroup label="Suggested">
            {suggested.map((player) => (
              <option key={player.id} value={player.id}>
                #{player.number} · {player.name}
              </option>
            ))}
          </optgroup>
        )}
        {rest.length > 0 && (
          <optgroup label="Other">
            {rest.map((player) => (
              <option key={player.id} value={player.id}>
                #{player.number} · {player.name} ({player.position})
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </label>
  );
}
