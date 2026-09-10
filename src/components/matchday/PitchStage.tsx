import Link from "next/link";
import { Jersey } from "@/components/shared/Jersey";
import { Pitch } from "@/components/shared/Pitch";
import { formationSlots } from "./formations";
import type { LineupSlotView, MatchInfo } from "./types";

function EmptyLineupCard() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-surface/62 p-6">
      <div className="flex max-w-xs flex-col items-center gap-3 rounded-2xl border border-fg/12 bg-surface-2 px-6 py-7 text-center shadow-floating-lit [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,0_100%)]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2M9 2h6" />
        </svg>
        <div className="font-heading text-xl leading-tight font-semibold uppercase">Lineup not yet announced</div>
        <p className="m-0 text-pretty text-sm leading-relaxed text-muted">
          Check back closer to kickoff. The XI is usually confirmed about an hour before the whistle.
        </p>
        <Link
          href="/squad"
          className="mt-1 inline-flex h-11 items-center justify-center rounded-full border border-accent px-5 font-heading text-sm font-semibold tracking-wider text-accent uppercase no-underline transition-colors hover:bg-accent/12"
        >
          Browse the squad
        </Link>
      </div>
    </div>
  );
}

function IncompleteLineupCard() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-surface/62 p-6">
      <div className="flex max-w-xs flex-col items-center gap-3 rounded-2xl border border-fg/12 bg-surface-2 px-6 py-7 text-center shadow-floating-lit [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,0_100%)]">
        <div className="font-heading text-xl leading-tight font-semibold uppercase">Lineup still being set</div>
        <p className="m-0 text-pretty text-sm leading-relaxed text-muted">
          The starting XI hasn&apos;t been fully confirmed yet. Check back closer to kickoff.
        </p>
      </div>
    </div>
  );
}

function Markers({ formation, starters }: { formation: MatchInfo["formation"]; starters: LineupSlotView[] }) {
  const slots = formationSlots(formation);
  return (
    <>
      {starters.map((starter, index) => {
        const slot = slots[starter.slotIndex] ?? slots[0];
        return (
          <div
            key={starter.slotIndex}
            className="animate-reveal-up absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${slot.x}%`, top: `${100 - slot.y}%`, animationDelay: `${index * 70}ms` }}
          >
            <Jersey number={starter.number} variant="filled" size={60} />
            <span className="rounded bg-surface/85 px-2 py-0.5 font-heading text-xs font-medium tracking-wide whitespace-nowrap uppercase">
              {starter.name}
            </span>
          </div>
        );
      })}
    </>
  );
}

export function PitchStage({ match, starters }: { match: MatchInfo; starters: LineupSlotView[] }) {
  const isComplete = starters.length === 11;

  return (
    <div className="animate-reveal-up relative mx-auto aspect-[68/105] w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[460px]">
      <Pitch landscape={false} />
      {!match.announced ? (
        <EmptyLineupCard />
      ) : isComplete ? (
        <Markers formation={match.formation} starters={starters} />
      ) : (
        <IncompleteLineupCard />
      )}
    </div>
  );
}
