import Link from "next/link";
import { HomeAwayBadge } from "./HomeAwayBadge";
import type { MatchResult } from "./types";

function ResultDot({ win }: { win: boolean }) {
  return (
    <span
      className={`h-2.5 w-2.5 flex-none rounded-full border-[1.5px] ${
        win ? "border-accent bg-accent" : "border-muted bg-transparent"
      }`}
    />
  );
}

function ScoreLine({ us, them, win, className = "" }: { us: number; them: number; win: boolean; className?: string }) {
  return (
    <div
      className={`flex skew-x-[-7deg] items-center gap-2 font-heading leading-none font-bold tracking-tight tabular-nums ${className}`}
    >
      <span className={win ? "text-accent" : undefined}>{us}</span>
      <span className="text-base font-medium text-muted">–</span>
      <span>{them}</span>
    </div>
  );
}

export function ResultRow({ result, delayMs = 0 }: { result: MatchResult; delayMs?: number }) {
  const { date, opponent, competition, home, us, them } = result;
  const win = us > them;

  return (
    <Link
      href="/news"
      className="animate-reveal-up block border-b border-fg/8 text-fg no-underline transition-[background-color,box-shadow] hover:bg-surface-2 hover:shadow-raised md:rounded-md"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="grid grid-cols-[10px_1fr_auto] items-center gap-3 py-4 md:hidden">
        <ResultDot win={win} />
        <div className="flex flex-col gap-1">
          <span className="font-heading text-lg font-semibold leading-tight">
            <span className="font-medium text-muted">vs</span> {opponent}
          </span>
          <span className="text-sm text-muted">
            {date} · {competition} · {home ? "H" : "A"}
          </span>
        </div>
        <ScoreLine us={us} them={them} win={win} className="text-[28px]" />
      </div>

      <div className="hidden min-h-[76px] grid-cols-[100px_1fr_90px_150px_32px] items-center gap-4 px-4 md:grid">
        <div className="flex flex-col gap-0.5">
          <span className="font-heading text-base font-semibold leading-tight">{date}</span>
          <span className="text-xs text-muted">{home ? "Home · Pearson Park" : "Away"}</span>
        </div>
        <div className="flex items-center gap-3">
          <ResultDot win={win} />
          <span className="font-heading text-xl font-semibold leading-tight">
            <span className="font-medium text-muted">vs</span> {opponent}
          </span>
        </div>
        <ScoreLine us={us} them={them} win={win} className="text-[32px]" />
        <span className="text-sm text-muted">{competition}</span>
        <HomeAwayBadge home={home} />
      </div>
    </Link>
  );
}
