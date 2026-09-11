"use client";

import { useActionState, useMemo } from "react";
import { Jersey } from "@/components/shared/Jersey";
import { Pitch } from "@/components/shared/Pitch";
import { formationSlots, lineGroups } from "@/components/matchday/formations";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD, ADMIN_LABEL } from "./admin-ui";
import { FormationChangeNotice, FormationPicker } from "./FormationPicker";
import { useFormationSlots } from "./useFormationSlots";
import type { LineupPlayerOption } from "./AdminLineupBuilder";

export type ShowcaseInitial = {
  formation: string;
  live: boolean;
  starters: (string | undefined)[];
};

export function AdminShowcaseBuilder({
  players,
  initial,
  action,
}: {
  players: LineupPlayerOption[];
  initial: ShowcaseInitial;
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
}) {
  const [error, formAction, pending] = useActionState(action, null);
  const { formation, slots, setSlot, changeFormation, undo, undoFormationChange, dismissUndo } = useFormationSlots(
    initial.formation,
    initial.starters,
  );

  const formId = "admin-showcase-form";
  const shape = formationSlots(formation);
  const byId = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  // `initial.live` is the saved state, not a draft toggle — each button says
  // exactly what saving it will do to the homepage.
  const live = initial.live;
  const filledCount = slots.filter(Boolean).length;
  const publishCta = live ? "Update homepage" : "Publish to homepage";
  const draftCta = live ? "Unpublish" : "Save draft";
  const liveHelp = live
    ? "This exact shape and XI are showing on the homepage now."
    : "The homepage squad stays empty until this is published — adding players on their own doesn't change it.";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 font-heading text-2xl leading-none font-bold tracking-[-0.005em] uppercase sm:text-[34px]">Squad showcase</h1>
          <span className="text-sm text-muted">
            The squad graphic shown on the homepage while the 2026/27 squad is still coming together.
          </span>
        </div>
        <div className="flex gap-2">
          <button type="submit" form={formId} name="live" value="" disabled={pending} className={ADMIN_BUTTON_SECONDARY}>
            {pending ? "Saving..." : draftCta}
          </button>
          <button type="submit" form={formId} name="live" value="on" disabled={pending} className={ADMIN_BUTTON_PRIMARY}>
            {pending ? "Saving..." : publishCta}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <form id={formId} action={formAction} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <input type="hidden" name="formation" value={formation} />
        {slots.map((playerId, i) => (
          <input key={i} type="hidden" name={`slot-${i}`} value={playerId} />
        ))}

        <div className="flex flex-col gap-4">
          <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FormationPicker formation={formation} onChange={changeFormation} />
              <span className={`flex items-center gap-2 font-heading text-[11px] font-semibold tracking-[0.1em] uppercase sm:text-xs ${live ? "text-accent" : "text-muted"}`}>
                <span className={`h-2 w-2 shrink-0 rounded-full ${live ? "bg-accent" : "bg-fg/30"}`} />
                {live ? "Live · showing on homepage" : "Draft · not visible on homepage"}
              </span>
            </div>

            <FormationChangeNotice undo={undo} onUndo={undoFormationChange} onDismiss={dismissUndo} />

            <div className="relative mx-auto aspect-[68/105] w-full max-w-[380px]">
              <Pitch landscape={false} />
              {shape.map((slot, i) => {
                const player = byId.get(slots[i]);
                return (
                  <div
                    key={i}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                    style={{ left: `${slot.x}%`, top: `${100 - slot.y}%` }}
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
        </div>

        <div className="flex flex-col gap-4">
          <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
            <div className="flex items-baseline justify-between">
              <span className={ADMIN_LABEL}>Starting XI</span>
              <span className={`font-heading text-xs font-semibold tracking-[0.1em] ${filledCount === 11 ? "text-accent" : "text-muted"}`}>
                {filledCount} / 11 PICKED
              </span>
            </div>
            {/* Keyed by slot range, not label: a label-keyed group remounts when
                the formation changes, and a freshly mounted <select> loses its
                value to React's post-action form reset. */}
            {lineGroups(formation).map((group) => (
              <div key={group.from} className="flex flex-col gap-2">
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
                                {p.id !== currentId && slots.includes(p.id) ? " · placed" : ""}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {rest.length > 0 && (
                          <optgroup label="Other">
                            {rest.map((p) => (
                              <option key={p.id} value={p.id}>
                                #{p.number} {p.name} · {p.position}
                                {p.id !== currentId && slots.includes(p.id) ? " · placed" : ""}
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

          <div className={`${ADMIN_CARD} flex flex-col gap-2 ${live ? "border-accent/50" : ""}`}>
            <span className="font-heading text-sm font-semibold tracking-[0.04em] uppercase">Homepage visibility</span>
            <span className="text-[13px] leading-relaxed text-muted">{liveHelp}</span>
            <span className="text-[13px] leading-relaxed text-muted">
              <strong className="font-semibold text-fg">{publishCta}</strong> puts this XI on the homepage.{" "}
              <strong className="font-semibold text-fg">{draftCta}</strong>{" "}
              {live ? "takes it back down and keeps your picks." : "keeps your picks here without showing them."}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
