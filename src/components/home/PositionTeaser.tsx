import Link from "next/link";
import type { StandingsSnapshot } from "./types";

export function PositionTeaser({ standings }: { standings: StandingsSnapshot }) {
  return (
    <Link
      href="/fixtures"
      className="flex items-center justify-between gap-4 rounded-2xl border border-fg/10 bg-surface-2 px-4 py-3.5 text-fg no-underline shadow-resting transition-[background-color,box-shadow] hover:bg-[oklch(0.24_0.015_260)] hover:shadow-raised [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,0_100%)]"
    >
      <div className="flex items-baseline gap-3">
        <span className="skew-x-[-7deg] font-heading text-2xl font-bold tabular-nums tracking-tight text-accent">
          {standings.position}
        </span>
        <span className="font-heading text-base font-semibold tracking-wide uppercase">{standings.points} pts</span>
        <span className="font-heading text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
          {standings.division}
        </span>
      </div>
      <span className="inline-flex items-center gap-1.5 font-heading text-[11px] font-medium tracking-[0.1em] whitespace-nowrap text-muted uppercase">
        Table (placeholder)
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
