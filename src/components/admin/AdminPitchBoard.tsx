"use client";

import { useRef } from "react";
import { Jersey } from "@/components/shared/Jersey";
import { Pitch } from "@/components/shared/Pitch";
import { useSlotDrag } from "./useSlotDrag";

export type PitchBoardEntry = {
  label: string;
  left: number;
  top: number;
  player?: { number: number; name: string };
};

/**
 * The pitch shown in both admin builders, with drag-to-reposition.
 *
 * Dragging a shirt onto another swaps the two; onto an empty spot moves it and
 * leaves the old one empty. Releasing outside the pitch cancels, so a fumbled
 * drag on a phone can't quietly empty a slot.
 */
export function AdminPitchBoard({
  entries,
  landscape = false,
  onSwap,
}: {
  entries: PitchBoardEntry[];
  landscape?: boolean;
  onSwap: (from: number, to: number) => void;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  // Width ÷ height of the board, so the drop maths can weigh a percent across
  // against a percent down.
  const aspect = landscape ? 105 / 68 : 68 / 105;
  const { drag, startDrag } = useSlotDrag({ boardRef, slots: entries, aspect, onDrop: onSwap });

  return (
    <div
      ref={boardRef}
      className={`relative w-full ${landscape ? "aspect-[105/68]" : "mx-auto aspect-[68/105] max-w-[380px]"}`}
    >
      <div className="absolute inset-0">
        <Pitch landscape={landscape} />
      </div>

      {entries.map((entry, index) => {
        const dragging = drag?.from === index;
        const isTarget = drag !== null && drag.over === index && drag.from !== index;
        const left = dragging ? drag.left : entry.left;
        const top = dragging ? drag.top : entry.top;

        return (
          <div
            key={index}
            onPointerDown={entry.player ? (event) => startDrag(index, event) : undefined}
            style={{ left: `${left}%`, top: `${top}%`, touchAction: entry.player ? "none" : undefined }}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 ${
              entry.player ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            } ${dragging ? "z-20 scale-110 opacity-90" : "z-10 transition-[left,top] duration-150"}`}
          >
            <div className={`rounded-full ${isTarget ? "ring-2 ring-accent ring-offset-2 ring-offset-transparent" : ""}`}>
              <Jersey number={entry.player?.number ?? 0} variant={entry.player ? "filled" : "outline"} size={40} />
            </div>
            <span className="pointer-events-none rounded-md bg-surface/88 px-1.5 py-0.5 text-[10px] font-medium tracking-wide whitespace-nowrap uppercase">
              {entry.player ? entry.player.name.split(" ").slice(-1)[0] : entry.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
