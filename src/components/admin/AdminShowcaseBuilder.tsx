"use client";

import { useActionState, useMemo } from "react";
import { formationSlots } from "@/components/matchday/formations";
import { ADMIN_BUTTON_PRIMARY, ADMIN_BUTTON_SECONDARY, ADMIN_CARD } from "./admin-ui";
import { AdminPitchBoard } from "./AdminPitchBoard";
import { FormationChangeNotice, FormationPicker } from "./FormationPicker";
import { StartingXiPicker } from "./StartingXiPicker";
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
  const byId = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  // `initial.live` is the saved state, not a draft toggle — each button says
  // exactly what saving it will do to the homepage.
  const live = initial.live;
  const publishCta = live ? "Update homepage" : "Publish to homepage";
  const draftCta = live ? "Unpublish" : "Save draft";
  const liveHelp = live
    ? "This exact shape and XI are showing on the homepage now."
    : "The homepage squad stays empty until this is published — adding players on their own doesn't change it.";

  const entries = formationSlots(formation).map((slot, i) => ({
    label: slot.label,
    left: slot.x,
    top: 100 - slot.y,
    player: byId.get(slots[i]),
  }));

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

      {/* The form carries only the hidden fields. React resets a form after a
          server action, which would snap every <select> inside it back to the
          value it first mounted with — blanking the XI after a save. */}
      <form id={formId} action={formAction} className="hidden">
        <input type="hidden" name="formation" value={formation} />
        {slots.map((playerId, i) => (
          <input key={i} type="hidden" name={`slot-${i}`} value={playerId} />
        ))}
      </form>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
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

            <AdminPitchBoard entries={entries} onSwap={(from, to) => setSlot(to, slots[from])} />

            <span className="text-center text-[11px] text-muted sm:text-xs">
              Drag a shirt to move it — drop it on another to swap the two.
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={`${ADMIN_CARD} flex flex-col gap-4`}>
            <StartingXiPicker formation={formation} slots={slots} players={players} onSelect={setSlot} />
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
      </div>
    </div>
  );
}
