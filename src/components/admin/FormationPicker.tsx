"use client";

import { FORMATION_OPTIONS, type Formation } from "@/components/matchday/formations";
import { ADMIN_LABEL } from "./admin-ui";
import type { FormationUndo } from "./useFormationSlots";

export function FormationPicker({
  formation,
  onChange,
}: {
  formation: Formation;
  onChange: (next: Formation) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className={ADMIN_LABEL}>Formation</span>
      <div className="flex flex-wrap gap-0.5 rounded-md border border-fg/12 bg-surface p-[3px]">
        {FORMATION_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={option === formation}
            className={`h-[30px] cursor-pointer rounded-md px-2.5 font-heading text-[11px] font-semibold tracking-[0.08em] tabular-nums transition-colors sm:px-3 sm:text-xs ${
              option === formation ? "bg-fg text-surface" : "text-muted hover:text-fg"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// Shown after a formation switch so the admin can see nothing was lost — and
// back out of the switch if it wasn't what they wanted.
export function FormationChangeNotice({
  undo,
  onUndo,
  onDismiss,
}: {
  undo: FormationUndo | null;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  if (!undo) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md border border-accent/40 bg-accent/8 px-3 py-2 text-xs sm:text-[13px]">
      <span className="text-fg">
        Moved {undo.carried} {undo.carried === 1 ? "pick" : "picks"} from {undo.from} into {undo.to} — check the
        positions below before saving.
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="cursor-pointer rounded-md border border-accent/60 px-2.5 py-1 font-heading text-[11px] font-semibold tracking-[0.08em] text-accent uppercase hover:bg-accent/12"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="cursor-pointer font-heading text-[11px] font-medium tracking-[0.08em] text-muted uppercase hover:text-fg"
      >
        Dismiss
      </button>
    </div>
  );
}
