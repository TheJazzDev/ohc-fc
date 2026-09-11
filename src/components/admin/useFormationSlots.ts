"use client";

import { useState } from "react";
import { formationSlots, type Formation } from "@/components/matchday/formations";
import { remapSlotsToFormation } from "@/components/matchday/remap-formation";

export type FormationUndo = { from: Formation; to: Formation; carried: number };

/**
 * Formation + slot state shared by the lineup and showcase builders.
 *
 * Switching formation carries the existing picks into the new shape rather
 * than clearing them, and keeps one step of history so the admin can undo a
 * switch they didn't mean to make.
 */
export function useFormationSlots(initialFormation: string, initialStarters: (string | undefined)[]) {
  const [formation, setFormation] = useState<Formation>((initialFormation as Formation) || "4-3-3");
  const [slots, setSlots] = useState<string[]>(() =>
    formationSlots(initialFormation).map((_, i) => initialStarters[i] ?? ""),
  );
  const [undo, setUndo] = useState<(FormationUndo & { slots: string[] }) | null>(null);

  function changeFormation(next: Formation) {
    if (next === formation) return;
    const carried = remapSlotsToFormation(formation, next, slots);
    const picked = slots.filter(Boolean).length;
    setUndo(picked > 0 ? { from: formation, to: next, carried: carried.filter(Boolean).length, slots } : null);
    setFormation(next);
    setSlots(carried);
  }

  function undoFormationChange() {
    if (!undo) return;
    setFormation(undo.from);
    setSlots(undo.slots);
    setUndo(null);
  }

  function dismissUndo() {
    setUndo(null);
  }

  function setSlot(index: number, playerId: string) {
    setSlots((prev) => {
      const next = [...prev];
      const out = next[index];
      const at = playerId ? next.indexOf(playerId) : -1;
      if (at > -1) next[at] = out; // straight swap between two slots
      next[index] = playerId;
      return next;
    });
  }

  return { formation, slots, setSlots, setSlot, changeFormation, undo, undoFormationChange, dismissUndo };
}
