import Link from "next/link";
import type { NextMatch } from "./types";

export function NextMatchCard({ match }: { match: NextMatch }) {
  return (
    <Link
      href="/matchday"
      className="group relative block rounded-2xl bg-accent/35 no-underline"
    >
      <div className="flex flex-col gap-2.5 rounded-2xl border border-fg/10 bg-surface-2 p-6 shadow-resting transition-[background-color,box-shadow] group-hover:bg-[oklch(0.24_0.015_260)] group-hover:shadow-floating-lit [clip-path:polygon(0_0,calc(100%-32px)_0,100%_32px,100%_100%,0_100%)]">
        <span className="font-heading text-xs font-semibold tracking-[0.14em] text-accent uppercase">Next match</span>
        <span className="font-heading text-2xl leading-tight font-semibold sm:text-[28px]">vs {match.opponent}</span>
        <span className="text-sm leading-relaxed text-muted sm:text-base">
          {match.date} · {match.time} · {match.competition}
        </span>
        <span className="mt-1 inline-flex items-center gap-1.5 font-heading text-xs font-medium tracking-[0.1em] text-fg uppercase">
          Matchday hub
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
