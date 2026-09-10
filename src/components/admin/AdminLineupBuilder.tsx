"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { Jersey } from "@/components/shared/Jersey";
import { Pitch } from "@/components/shared/Pitch";
import {
  FORMATION_OPTIONS,
  formationSlots,
  formationSlotsLandscape,
  lineGroups,
  type Formation,
} from "@/components/matchday/formations";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_LABEL } from "./admin-ui";

const BENCH_MAX = 7;

export type LineupPlayerOption = { id: string; number: number; name: string; position: string };

export type LineupInitial = {
  formation: string;
  announced: boolean;
  starters: (string | undefined)[];
  bench: string[];
};

export function AdminLineupBuilder({
  players,
  initial,
  matchTitle,
  matchMeta,
  action,
}: {
  players: LineupPlayerOption[];
  initial: LineupInitial;
  matchTitle: string;
  matchMeta: string;
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const [formation, setFormation] = useState<Formation>((initial.formation as Formation) || "4-3-3");
  const [slots, setSlots] = useState<string[]>(() => formationSlots(initial.formation).map((_, i) => initial.starters[i] ?? ""));
  const [bench, setBench] = useState<string[]>(initial.bench);
  const [announced, setAnnounced] = useState(initial.announced);

  const formId = "admin-lineup-form";
  const shape = formationSlots(formation);
  const landscapeShape = formationSlotsLandscape(formation);
  const byId = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  function handleFormationChange(next: Formation) {
    setFormation(next);
    setSlots(formationSlots(next).map(() => ""));
  }

  function setSlot(index: number, playerId: string) {
    setSlots((prev) => {
      const next = [...prev];
      const out = next[index];
      const at = playerId ? next.indexOf(playerId) : -1;
      if (at > -1) next[at] = out; // straight swap between two starters
      next[index] = playerId;
      return next;
    });
    setBench((prev) => {
      let next = prev.filter((id) => id !== playerId); // promoted off the bench
      const out = slots[index];
      const alreadyStarting = playerId && slots.indexOf(playerId) > -1;
      if (!alreadyStarting && out && !next.includes(out) && next.length < BENCH_MAX) next = next.concat(out);
      return next;
    });
  }

  function toggleBench(playerId: string) {
    setBench((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : prev.length >= BENCH_MAX ? prev : prev.concat(playerId)));
  }

  const filledCount = slots.filter(Boolean).length;
  const benchCandidates = players.filter((p) => !slots.includes(p.id));
  const announceCta = announced ? "Update lineup" : "Announce lineup";
  const announceHelp = announced
    ? "The XI and bench are showing on the Matchday page now."
    : "Fans see “Lineup not yet announced” until this is switched on.";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <Link href="/admin/fixtures" className="flex items-center gap-1.5 font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase no-underline hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back to fixtures
          </Link>
          <h1 className="m-0 font-heading text-2xl leading-none font-bold tracking-[-0.005em] uppercase sm:text-[34px]">Lineup · {matchTitle}</h1>
          <span className="text-sm text-muted">{matchMeta}</span>
        </div>
        <div className="flex gap-2">
          <button type="submit" form={formId} name="announced" value="" disabled={pending} className={ADMIN_BUTTON_SECONDARY}>
            {pending ? "Saving..." : "Save draft"}
          </button>
          <button type="submit" form={formId} name="announced" value={announced ? "on" : ""} disabled={pending} className={ADMIN_BUTTON_PRIMARY}>
            {pending ? "Saving..." : announceCta}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form id={formId} action={formAction} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <input type="hidden" name="formation" value={formation} />
        {slots.map((playerId, i) => (
          <input key={i} type="hidden" name={`slot-${i}`} value={playerId} />
        ))}
        {bench.map((id) => (
          <input key={id} type="hidden" name="bench" value={id} />
        ))}

        <div className="flex flex-col gap-4">
          <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={ADMIN_LABEL}>Formation</span>
                <div className="flex gap-0.5 rounded-md border border-fg/12 bg-surface p-[3px]">
                  {FORMATION_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleFormationChange(option)}
                      className={`h-[30px] cursor-pointer rounded-md px-3.5 font-heading text-xs font-semibold tracking-[0.08em] tabular-nums transition-colors ${
                        option === formation ? "bg-fg text-surface" : "text-muted hover:text-fg"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <span className={`flex items-center gap-2 font-heading text-xs font-semibold tracking-[0.1em] uppercase ${announced ? "text-accent" : "text-muted"}`}>
                <span className={`h-2 w-2 rounded-full ${announced ? "bg-accent" : "bg-fg/30"}`} />
                {announced ? "Announced · live on the site" : "Draft · not visible to fans"}
              </span>
            </div>

            <div className="relative aspect-[105/68] w-full">
              <div className="absolute inset-0">
                <Pitch landscape />
              </div>
              {landscapeShape.map((slot, i) => {
                const player = byId.get(slots[i]);
                return (
                  <div
                    key={i}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                    style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
                  >
                    <Jersey number={player?.number ?? 0} variant={player ? "filled" : "outline"} size={40} />
                    <span className="rounded-md bg-surface/88 px-1.5 py-0.5 text-[10px] font-medium tracking-wide whitespace-nowrap uppercase">
                      {player ? player.name.split(" ").slice(-1)[0] : slot.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${ADMIN_CARD} flex flex-col gap-3.5`}>
            <div className="flex items-baseline justify-between gap-4">
              <span className={ADMIN_LABEL}>Bench · pick up to {BENCH_MAX}</span>
              <span className={`font-heading text-xs font-semibold tracking-[0.1em] ${bench.length === BENCH_MAX ? "text-accent" : "text-muted"}`}>
                {bench.length} / {BENCH_MAX} SELECTED
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {benchCandidates.map((p) => {
                const on = bench.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleBench(p.id)}
                    className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-md border px-3 text-left transition-colors ${
                      on ? "border-accent/50 bg-accent/[0.09]" : "border-fg/12 bg-surface"
                    }`}
                  >
                    <span className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[4px] border-[1.5px] ${on ? "border-accent bg-accent text-surface" : "border-fg/30 bg-transparent"}`}>
                      {on && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={`font-heading text-sm font-bold tabular-nums ${on ? "text-accent" : "text-muted"}`}>{p.number}</span>
                    <span className={`min-w-0 flex-1 truncate text-[13px] ${on ? "text-fg" : "text-muted"}`}>{p.name}</span>
                    <span className="font-heading text-[10px] font-medium tracking-[0.1em] text-muted">{p.position}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
            <div className="flex items-baseline justify-between">
              <span className={ADMIN_LABEL}>Starting XI</span>
              <span className={`font-heading text-xs font-semibold tracking-[0.1em] ${filledCount === 11 ? "text-accent" : "text-muted"}`}>
                {filledCount} / 11 PICKED
              </span>
            </div>
            {lineGroups(formation).map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <span className="font-heading text-[10px] font-medium tracking-[0.14em] text-muted uppercase">{group.label}</span>
                {shape.slice(group.from, group.to).map((slot, k) => {
                  const i = group.from + k;
                  const currentId = slots[i];
                  const suggested = players.filter((p) => p.position === slot.position);
                  const rest = players.filter((p) => p.position !== slot.position);
                  return (
                    <div key={i} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-2.5">
                      <span className="flex h-[34px] items-center justify-center rounded-md border border-fg/12 bg-surface font-heading text-[11px] font-semibold tracking-[0.08em]">
                        {slot.label}
                      </span>
                      <select
                        value={currentId}
                        onChange={(e) => setSlot(i, e.target.value)}
                        className="h-[34px] cursor-pointer rounded-md border border-fg/14 bg-surface px-2.5 text-sm outline-none focus:border-accent"
                      >
                        <option value="">— Select player —</option>
                        {suggested.length > 0 && (
                          <optgroup label="Suggested">
                            {suggested.map((p) => (
                              <option key={p.id} value={p.id}>
                                #{p.number} {p.name}
                                {p.id !== currentId && slots.includes(p.id) ? " · starting" : ""}
                                {bench.includes(p.id) ? " · bench" : ""}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {rest.length > 0 && (
                          <optgroup label="Other">
                            {rest.map((p) => (
                              <option key={p.id} value={p.id}>
                                #{p.number} {p.name} · {p.position}
                                {p.id !== currentId && slots.includes(p.id) ? " · starting" : ""}
                                {bench.includes(p.id) ? " · bench" : ""}
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
          </div>

          <div className={`${ADMIN_CARD} flex flex-col gap-3.5 ${announced ? "border-accent/50" : ""}`}>
            <div className="flex flex-col gap-1">
              <span className="font-heading text-sm font-semibold tracking-[0.04em] uppercase">Announce lineup</span>
              <span className="text-[13px] leading-relaxed text-muted">{announceHelp}</span>
            </div>
            <div className="grid grid-cols-2 gap-0.5 rounded-md border border-fg/12 bg-surface p-[3px]">
              {(["Draft", "Announced"] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setAnnounced(label === "Announced")}
                  className={`h-8 cursor-pointer rounded-md font-heading text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                    (label === "Announced") === announced ? "bg-fg text-surface" : "text-muted hover:text-fg"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
