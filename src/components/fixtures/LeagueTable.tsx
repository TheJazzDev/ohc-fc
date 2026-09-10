import type { TableRow } from "./types";

const CLUB_NAME = "OHC FC";

function lineLabel(index: number): string | null {
  if (index === 0) return "PLAY-OFF PLACES";
  if (index === 7) return "RELEGATION";
  return null;
}

function DividerLine({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 px-1 pt-2 pb-0.5 sm:gap-3 sm:px-4 sm:pt-2.5">
      <span className="h-px flex-1 bg-fg/14" />
      <span className="font-heading text-[10px] font-medium tracking-[0.12em] text-muted sm:text-[10px] sm:tracking-[0.14em]">
        {label}
      </span>
      <span className="h-px flex-1 bg-fg/14" />
    </div>
  );
}

export function LeagueTable({ rows, delayMs = 0 }: { rows: TableRow[]; delayMs?: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-[28px_minmax(0,1fr)_32px_40px_44px] items-center gap-2 border-b border-fg/12 px-1 pb-2.5 font-heading text-[10px] font-medium tracking-[0.1em] text-muted sm:hidden">
        <span>#</span>
        <span>TEAM</span>
        <span className="text-center">P</span>
        <span className="text-center">GD</span>
        <span className="text-center">PTS</span>
      </div>
      <div className="hidden grid-cols-[44px_minmax(0,1fr)_repeat(6,44px)_52px_64px] items-center gap-2 border-b border-fg/12 px-4 pb-3 font-heading text-[11px] font-medium tracking-[0.12em] text-muted sm:grid">
        <span>POS</span>
        <span>TEAM</span>
        <span className="text-center">P</span>
        <span className="text-center">W</span>
        <span className="text-center">D</span>
        <span className="text-center">L</span>
        <span className="text-center">GF</span>
        <span className="text-center">GA</span>
        <span className="text-center">GD</span>
        <span className="text-center">PTS</span>
      </div>

      {rows.map((row, index) => {
        const isUs = row.team === CLUB_NAME;
        const pos = index + 1;
        const pts = row.won * 3 + row.drawn;
        const gd = row.goalsFor - row.goalsAgainst;
        const gdLabel = gd > 0 ? `+${gd}` : String(gd);
        const label = lineLabel(index);

        return (
          <div
            key={row.team}
            className="animate-reveal-up flex flex-col"
            style={{ animationDelay: `${delayMs + index * 70}ms` }}
          >
            <div
              className={`grid min-h-11 grid-cols-[28px_minmax(0,1fr)_32px_40px_44px] items-center gap-2 rounded-lg border-l-2 px-1 transition-colors hover:bg-surface-2 sm:min-h-14 sm:grid-cols-[44px_minmax(0,1fr)_repeat(6,44px)_52px_64px] sm:gap-2 sm:px-4 ${
                isUs ? "border-l-accent bg-accent/[9%] shadow-resting" : "border-l-transparent"
              }`}
            >
              <span className={`font-heading text-sm font-semibold tabular-nums ${isUs ? "text-accent" : "text-muted"}`}>
                {pos}
              </span>
              <span
                className={`overflow-hidden font-heading text-base leading-tight font-semibold text-ellipsis whitespace-nowrap sm:text-lg ${
                  isUs ? "text-fg" : "text-fg/85"
                }`}
              >
                {row.team}
              </span>
              <span className="text-center font-heading text-sm font-medium tabular-nums text-muted">{row.played}</span>
              <span className="hidden text-center font-heading text-sm font-medium tabular-nums text-muted sm:block">
                {row.won}
              </span>
              <span className="hidden text-center font-heading text-sm font-medium tabular-nums text-muted sm:block">
                {row.drawn}
              </span>
              <span className="hidden text-center font-heading text-sm font-medium tabular-nums text-muted sm:block">
                {row.lost}
              </span>
              <span className="hidden text-center font-heading text-sm font-medium tabular-nums text-muted sm:block">
                {row.goalsFor}
              </span>
              <span className="hidden text-center font-heading text-sm font-medium tabular-nums text-muted sm:block">
                {row.goalsAgainst}
              </span>
              <span className="text-center font-heading text-sm font-medium tabular-nums text-fg">{gdLabel}</span>
              <span
                className={`skew-x-[-7deg] text-center font-heading text-lg font-bold tabular-nums tracking-tight sm:text-2xl ${
                  isUs ? "text-accent" : "text-fg"
                }`}
              >
                {pts}
              </span>
            </div>
            {label && <DividerLine label={label} />}
          </div>
        );
      })}

      <p className="px-1 pt-4 text-xs leading-relaxed text-muted sm:hidden">Full W · D · L · GF · GA columns on tablet and desktop.</p>
      <p className="hidden px-4 pt-4 text-sm leading-relaxed text-muted sm:block">
        Regional Division One · after 8 matches · champions promoted, second to fifth enter the play-offs, bottom two
        relegated.
      </p>
    </div>
  );
}
