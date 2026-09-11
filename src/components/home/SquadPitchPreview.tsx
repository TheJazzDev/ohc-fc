import Link from "next/link";
import { Jersey } from "@/components/shared/Jersey";
import { Pitch } from "@/components/shared/Pitch";
import type { Position } from "@/components/squad/types";
import { formationSlots } from "@/components/matchday/formations";

const DEFAULT_SHAPE = "4-3-3";

type RosterPlayer = { id: string; number: number; name: string; position: Position };
type PitchSlotView = { left: number; top: number; player: RosterPlayer | null };

// The homepage pitch only ever mirrors the admin-curated showcase — same slots
// the real matchday pitch uses, filled with whoever the admin placed in each
// one. Signing a player never puts them on the homepage by itself; until the
// showcase is published every slot reads TBC.
function showcaseSlots(formation: string, starterIds: (string | undefined)[], players: RosterPlayer[]): PitchSlotView[] {
  const byId = new Map(players.map((player) => [player.id, player]));
  return formationSlots(formation).map((slot, index) => ({
    left: slot.x,
    top: 100 - slot.y,
    player: byId.get(starterIds[index] ?? "") ?? null,
  }));
}

export type SquadShowcaseData = { formation: string; starterIds: (string | undefined)[] } | null;

export function SquadPitchPreview({ players, showcase }: { players: RosterPlayer[]; showcase: SquadShowcaseData }) {
  const slots = showcaseSlots(showcase?.formation ?? DEFAULT_SHAPE, showcase?.starterIds ?? [], players);
  const filledCount = slots.filter((slot) => slot.player).length;
  const total = slots.length;
  const complete = filledCount === total;

  return (
    <section className="mx-auto flex max-w-app flex-col gap-5 border-b border-fg/10 px-4 py-8 sm:gap-6 sm:px-8 sm:py-12 lg:py-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-heading text-2xl leading-none font-semibold uppercase sm:text-3xl lg:text-4xl">
          The squad
        </h2>
        <span className="font-heading text-xs font-medium tracking-[0.12em] text-muted uppercase sm:text-sm">
          {filledCount} of {total} confirmed
        </span>
      </div>

      <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base lg:text-lg">
        {complete
          ? "The full 2026/27 starting shape — every spot confirmed."
          : "The 2026/27 squad is still coming together. Confirmed players below — the rest of the shape fills in as more join."}
      </p>

      <div className="relative mx-auto aspect-[68/105] w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[640px]">
        <Pitch landscape={false} />
        {slots.map((slot, index) => (
          <div
            key={index}
            className="animate-reveal-up absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 lg:scale-[1.3]"
            style={{ left: `${slot.left}%`, top: `${slot.top}%`, animationDelay: `${index * 70}ms` }}
          >
            {slot.player ? (
              <>
                <Jersey number={slot.player.number} variant="filled" size={52} />
                <span className="rounded bg-surface/85 px-1.5 py-0.5 font-heading text-[11px] font-medium tracking-wide whitespace-nowrap uppercase">
                  {slot.player.name}
                </span>
              </>
            ) : (
              <>
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-dashed border-fg/25 font-heading text-lg font-bold text-fg/35">
                  ?
                </div>
                <span className="rounded bg-surface/60 px-1.5 py-0.5 font-heading text-[11px] font-medium tracking-wide text-muted uppercase">
                  TBC
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      <Link
        href="/squad"
        className="mx-auto inline-flex h-11 items-center justify-center rounded-md border border-accent px-5 font-heading text-sm font-semibold tracking-wider text-accent uppercase no-underline transition-colors hover:bg-accent/12"
      >
        View full squad
      </Link>
    </section>
  );
}
