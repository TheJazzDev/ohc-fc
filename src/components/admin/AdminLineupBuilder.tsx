"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { formationSlotsLandscape } from "@/components/matchday/formations";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_LABEL } from "./admin-ui";
import { AdminPitchBoard } from "./AdminPitchBoard";
import { FormationChangeNotice, FormationPicker } from "./FormationPicker";
import { StartingXiPicker } from "./StartingXiPicker";
import { useFormationSlots } from "./useFormationSlots";

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
  const {
    formation,
    slots,
    setSlot: seatStarter,
    changeFormation,
    undo,
    undoFormationChange,
    dismissUndo,
  } = useFormationSlots(initial.formation, initial.starters);
  const [bench, setBench] = useState<string[]>(initial.bench);

  const formId = "admin-lineup-form";
  const byId = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);
  const entries = formationSlotsLandscape(formation).map((slot, i) => ({
    label: slot.label,
    left: slot.left,
    top: slot.top,
    player: byId.get(slots[i]),
  }));

  // `initial.announced` is the saved state, not a draft toggle — each button
  // says exactly what saving it will do to the public matchday page.
  const announced = initial.announced;

  function setSlot(index: number, playerId: string) {
    seatStarter(index, playerId);
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

  const benchCandidates = players.filter((p) => !slots.includes(p.id));
  const announceCta = announced ? "Update lineup" : "Announce lineup";
  const draftCta = announced ? "Unannounce" : "Save draft";
  const announceHelp = announced
    ? "The XI and bench are showing on the Matchday page now."
    : "Fans see “Lineup not yet announced” until this is announced.";

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
            {pending ? "Saving..." : draftCta}
          </button>
          <button type="submit" form={formId} name="announced" value="on" disabled={pending} className={ADMIN_BUTTON_PRIMARY}>
            {pending ? "Saving..." : announceCta}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* The form carries only the hidden fields. React resets a form after a
          server action, which would snap every <select> inside it back to the
          value it first mounted with — blanking the XI after a save. */}
      <form id={formId} action={formAction} className="hidden">
        <input type="hidden" name="formation" value={formation} />
        {slots.map((playerId, i) => (
          <input key={i} type="hidden" name={`slot-${i}`} value={playerId} />
        ))}
        {bench.map((id) => (
          <input key={id} type="hidden" name="bench" value={id} />
        ))}
      </form>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">

        <div className="flex flex-col gap-4">
          <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FormationPicker formation={formation} onChange={changeFormation} />
              <span className={`flex items-center gap-2 font-heading text-[11px] font-semibold tracking-[0.1em] uppercase sm:text-xs ${announced ? "text-accent" : "text-muted"}`}>
                <span className={`h-2 w-2 shrink-0 rounded-full ${announced ? "bg-accent" : "bg-fg/30"}`} />
                {announced ? "Announced · live on the site" : "Draft · not visible to fans"}
              </span>
            </div>

            <FormationChangeNotice undo={undo} onUndo={undoFormationChange} onDismiss={dismissUndo} />

            <AdminPitchBoard entries={entries} landscape onSwap={(from, to) => setSlot(to, slots[from])} />

            <span className="text-center text-[11px] text-muted sm:text-xs">
              Drag a shirt to move it — drop it on another to swap the two.
            </span>
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
            <StartingXiPicker
              formation={formation}
              slots={slots}
              players={players}
              onSelect={setSlot}
              note={(playerId) => (bench.includes(playerId) ? " · bench" : "")}
            />
          </div>

          <div className={`${ADMIN_CARD} flex flex-col gap-2 ${announced ? "border-accent/50" : ""}`}>
            <span className="font-heading text-sm font-semibold tracking-[0.04em] uppercase">Announce lineup</span>
            <span className="text-[13px] leading-relaxed text-muted">{announceHelp}</span>
            <span className="text-[13px] leading-relaxed text-muted">
              <strong className="font-semibold text-fg">{announceCta}</strong> puts this XI on the Matchday page.{" "}
              <strong className="font-semibold text-fg">{draftCta}</strong>{" "}
              {announced ? "takes it back down and keeps your picks." : "keeps your picks here without showing them."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
