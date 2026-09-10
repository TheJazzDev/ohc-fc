"use client";

import { useActionState, useState } from "react";
import { saveLineup } from "@/actions/lineups";
import { FORMATION_OPTIONS, formationSlots, isFormation, type Formation } from "@/components/matchday/formations";
import { BenchPicker } from "./BenchPicker";
import { LineupSlotRow, type PlayerOption } from "./LineupSlotRow";

export type InitialLineup = {
  formation: string;
  announced: boolean;
  starters: (string | undefined)[]; // length 11, indexed by slotIndex
  bench: string[];
};

export function LineupPicker({
  fixtureId,
  players,
  initial,
}: {
  fixtureId: string;
  players: PlayerOption[];
  initial: InitialLineup;
}) {
  const action = saveLineup.bind(null, fixtureId);
  const [error, formAction, pending] = useActionState(action, null);

  const startingFormation = isFormation(initial.formation) ? initial.formation : "4-3-3";
  const [formation, setFormation] = useState<Formation>(startingFormation);
  const [starters, setStarters] = useState<(string | undefined)[]>(() =>
    formation === initial.formation ? initial.starters : Array(11).fill(undefined),
  );
  const [bench, setBench] = useState<string[]>(initial.bench);
  const [announced, setAnnounced] = useState(initial.announced);

  const slots = formationSlots(formation);
  const usedIds = new Set(starters.filter((id): id is string => !!id));
  const benchCandidates = players.filter((player) => !usedIds.has(player.id));

  function handleFormationChange(next: Formation) {
    setFormation(next);
    setStarters(Array(11).fill(undefined));
  }

  function handleStarterChange(index: number, playerId: string) {
    setStarters((prev) => {
      const updated = [...prev];
      updated[index] = playerId || undefined;
      return updated;
    });
    if (playerId) setBench((prev) => prev.filter((id) => id !== playerId));
  }

  function handleBenchToggle(playerId: string) {
    setBench((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm">
        Formation
        <select
          value={formation}
          onChange={(event) => handleFormationChange(event.target.value as Formation)}
          className="rounded-md border border-fg/20 bg-surface-2 px-3 py-2.5 text-sm text-fg outline-none focus:border-accent sm:text-base"
        >
          {FORMATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input type="hidden" name="formation" value={formation} />
      </label>

      <div className="flex flex-col gap-2.5">
        <span className="font-heading text-xs font-bold tracking-wide uppercase">Starting XI</span>
        {slots.map((slot, index) => (
          <div key={index}>
            <LineupSlotRow
              label={slot.label}
              suggestedPosition={slot.position}
              players={players}
              value={starters[index] ?? ""}
              onChange={(playerId) => handleStarterChange(index, playerId)}
            />
            <input type="hidden" name={`slot-${index}`} value={starters[index] ?? ""} />
          </div>
        ))}
      </div>

      <BenchPicker players={benchCandidates} selected={bench} onToggle={handleBenchToggle} />

      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="announced"
          checked={announced}
          onChange={(event) => setAnnounced(event.target.checked)}
          className="h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
        />
        Announce this lineup on the public site
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-md bg-accent px-4 py-2.5 font-heading text-sm font-bold tracking-wide text-surface uppercase disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
      >
        {pending ? "Saving..." : "Save lineup"}
      </button>
    </form>
  );
}
