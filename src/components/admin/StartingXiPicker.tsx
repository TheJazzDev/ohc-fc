"use client";

import { formationSlots, lineGroups } from "@/components/matchday/formations";
import { ADMIN_LABEL } from "./admin-ui";
import type { LineupPlayerOption } from "./AdminLineupBuilder";

/**
 * The slot-by-slot dropdowns shared by both builders.
 *
 * A player already placed somewhere is left out of every other slot's list —
 * to move them, drag them on the pitch, or clear their slot to free them up.
 */
export function StartingXiPicker({
  formation,
  slots,
  players,
  onSelect,
  note,
}: {
  formation: string;
  slots: string[];
  players: LineupPlayerOption[];
  onSelect: (index: number, playerId: string) => void;
  note?: (playerId: string) => string;
}) {
  const shape = formationSlots(formation);
  const placed = new Set(slots.filter(Boolean));
  const filledCount = slots.filter(Boolean).length;

  return (
    <>
      <div className="flex items-baseline justify-between">
        <span className={ADMIN_LABEL}>Starting XI</span>
        <span
          className={`font-heading text-xs font-semibold tracking-[0.1em] ${
            filledCount === shape.length ? "text-accent" : "text-muted"
          }`}
        >
          {filledCount} / {shape.length} PICKED
        </span>
      </div>

      {/* Keyed by slot range, not label: labels aren't stable identity across
          formations ("Midfield three" becomes "Midfield four"). */}
      {lineGroups(formation).map((group) => (
        <div key={group.from} className="flex flex-col gap-2">
          <span className="font-heading text-[10px] font-medium tracking-[0.14em] text-muted uppercase">
            {group.label}
          </span>
          {shape.slice(group.from, group.to).map((slot, k) => {
            const i = group.from + k;
            const currentId = slots[i];
            const available = players.filter((p) => p.id === currentId || !placed.has(p.id));
            const suggested = available.filter((p) => p.position === slot.position);
            const rest = available.filter((p) => p.position !== slot.position);

            return (
              <div key={i} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-2.5">
                <span className="flex h-[34px] items-center justify-center rounded-md border border-fg/12 bg-surface font-heading text-[11px] font-semibold tracking-[0.08em]">
                  {slot.label}
                </span>
                <select
                  value={currentId}
                  onChange={(e) => onSelect(i, e.target.value)}
                  className="h-[34px] cursor-pointer rounded-md border border-fg/14 bg-surface px-2.5 text-sm outline-none focus:border-accent"
                >
                  <option value="">— Select player —</option>
                  {suggested.length > 0 && (
                    <optgroup label="Suggested">
                      {suggested.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.number} {p.name}
                          {note?.(p.id) ?? ""}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {rest.length > 0 && (
                    <optgroup label="Other">
                      {rest.map((p) => (
                        <option key={p.id} value={p.id}>
                          #{p.number} {p.name} · {p.position}
                          {note?.(p.id) ?? ""}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
