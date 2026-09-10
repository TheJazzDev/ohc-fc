import Link from "next/link";
import { HomeAwayBadge } from "./HomeAwayBadge";
import type { UpcomingFixture } from "./types";

export function FixtureRow({ fixture, delayMs = 0 }: { fixture: UpcomingFixture; delayMs?: number }) {
  const { date, time, opponent, competition, home } = fixture;

  return (
    <Link
      href="/matchday"
      className="animate-reveal-up block border-b border-fg/8 text-fg no-underline transition-[background-color,box-shadow] hover:bg-surface-2 hover:shadow-raised md:rounded-2xl"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-4 md:hidden">
        <div className="flex flex-col gap-1">
          <span className="font-heading text-lg font-semibold leading-tight">
            <span className="font-medium text-muted">vs</span> {opponent}
          </span>
          <span className="text-sm text-muted">
            {date} · {time} · {competition}
          </span>
        </div>
        <HomeAwayBadge home={home} />
      </div>

      <div className="hidden min-h-[76px] grid-cols-[100px_1fr_150px_80px_32px] items-center gap-4 px-4 md:grid">
        <div className="flex flex-col gap-0.5">
          <span className="font-heading text-base font-semibold leading-tight">{date}</span>
          <span className="font-heading text-xs tracking-wider text-muted">{time}</span>
        </div>
        <span className="font-heading text-xl font-semibold leading-tight">
          <span className="font-medium text-muted">vs</span> {opponent}
        </span>
        <span className="text-sm text-muted">{competition}</span>
        <span className="text-sm text-muted">{home ? "Home · Pearson Park" : "Away"}</span>
        <HomeAwayBadge home={home} />
      </div>
    </Link>
  );
}
