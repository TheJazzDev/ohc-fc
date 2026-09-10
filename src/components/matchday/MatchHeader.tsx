import type { MatchInfo } from "./types";

const PANEL_CUT = "[clip-path:polygon(0_0,100%_0,100%_100%,32px_100%,0_calc(100%-32px))]";

export function MatchHeader({ match }: { match: MatchInfo }) {
  const statusLabel = match.announced ? "Starting XI" : "Pre-match";

  return (
    <div
      className={`animate-reveal-up relative flex flex-col gap-4 rounded-2xl border border-fg/10 bg-surface-2/70 p-6 shadow-raised backdrop-blur-sm sm:p-7 ${PANEL_CUT}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            {[match.competition, match.round, match.venue].filter(Boolean).join(" · ")}
          </span>
          <h1 className="font-heading text-2xl leading-tight font-bold text-balance uppercase sm:text-4xl lg:text-5xl">
            OHC FC <span className="font-medium text-muted">vs</span> {match.opponent}
          </h1>
          <span className="text-sm text-muted sm:text-base">
            {match.date} · {match.time} · {match.ground}
          </span>
        </div>

        <div className="flex flex-none items-center gap-2">
          <span className="inline-flex h-8 items-center rounded-full bg-accent px-4 font-heading text-xs font-bold tracking-wider whitespace-nowrap text-surface uppercase sm:h-[34px] sm:px-[18px] sm:text-[13px]">
            {statusLabel}
          </span>
          {match.announced && (
            <span className="inline-flex h-8 items-center rounded-full border border-accent/40 px-4 font-heading text-xs font-semibold tracking-wider whitespace-nowrap uppercase sm:h-[34px] sm:px-[18px] sm:text-[13px]">
              {match.formation}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
