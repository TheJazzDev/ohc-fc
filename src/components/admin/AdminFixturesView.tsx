"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatShortDate, formatTime } from "@/lib/format-kickoff";
import { ADMIN_BUTTON_PRIMARY, ADMIN_EYEBROW, ADMIN_H1, ADMIN_ROW_ACTION, ADMIN_TABLE_HEAD_CELL } from "./admin-ui";

export type AdminFixtureRowData = {
  id: string;
  opponent: string;
  competition: string;
  kickoff: Date;
  venue: "HOME" | "AWAY";
  status: "SCHEDULED" | "PLAYED" | "POSTPONED" | "CANCELLED";
  ourScore: number | null;
  theirScore: number | null;
};

const TABS = ["Upcoming", "Results"] as const;

export function AdminFixturesView({ fixtures, playedCount, upcomingCount }: { fixtures: AdminFixtureRowData[]; playedCount: number; upcomingCount: number }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Upcoming");

  const rows = useMemo(() => {
    const filtered = fixtures.filter((f) => (tab === "Results" ? f.status === "PLAYED" : f.status !== "PLAYED"));
    return [...filtered].sort((a, b) => (tab === "Upcoming" ? a.kickoff.getTime() - b.kickoff.getTime() : b.kickoff.getTime() - a.kickoff.getTime()));
  }, [fixtures, tab]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <span className={ADMIN_EYEBROW}>
            SEASON 2026/27 · {playedCount} PLAYED · {upcomingCount} TO COME
          </span>
          <h1 className={ADMIN_H1}>Fixtures</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-0.5 rounded-md border border-fg/10 bg-surface-2 p-[3px]">
            {TABS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setTab(label)}
                className={`h-8 cursor-pointer rounded-md px-3.5 font-heading text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  label === tab ? "bg-fg text-surface" : "text-muted hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Link href="/admin/fixtures/new" className={ADMIN_BUTTON_PRIMARY}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add fixture
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-fg/10 bg-surface-2 shadow-resting">
        <div className="hidden grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)_190px_90px_110px_220px] items-center gap-4 border-b border-fg/10 px-5 py-2.5 lg:grid">
          <span className={ADMIN_TABLE_HEAD_CELL}>Opponent</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Competition</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Kickoff</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Venue</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Score</span>
          <span className={`${ADMIN_TABLE_HEAD_CELL} text-right`}>Actions</span>
        </div>

        {rows.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No {tab.toLowerCase()} fixtures yet.</p>
        ) : (
          rows.map((fixture) => {
            const done = fixture.status === "PLAYED";
            const scoreLabel = done && fixture.ourScore != null && fixture.theirScore != null ? `${fixture.ourScore}–${fixture.theirScore}` : "—";
            return (
              <div
                key={fixture.id}
                className="flex flex-col gap-2 border-b border-fg/6 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[oklch(0.24_0.015_260)] lg:grid lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)_190px_90px_110px_220px] lg:items-center lg:gap-4 lg:py-0 lg:min-h-14"
              >
                <span className="flex items-center gap-2.5">
                  <span className={`h-[7px] w-[7px] flex-none rounded-full border-[1.5px] ${done ? "border-muted bg-transparent" : "border-accent bg-accent"}`} />
                  <span className="truncate font-heading text-base font-semibold sm:text-[17px]">
                    {fixture.venue === "HOME" ? "vs" : "@"} {fixture.opponent}
                  </span>
                </span>
                <span className="truncate text-sm text-muted">{fixture.competition}</span>
                <span className="font-heading text-sm font-medium tabular-nums">
                  {formatShortDate(fixture.kickoff)} · {formatTime(fixture.kickoff)}
                </span>
                <span className={`inline-flex h-6 w-fit items-center rounded-md border border-fg/20 px-2 font-heading text-[11px] font-semibold tracking-[0.1em] ${fixture.venue === "HOME" ? "text-fg" : "text-muted"}`}>
                  {fixture.venue === "HOME" ? "H" : "A"}
                </span>
                <span className="font-heading text-lg font-bold tabular-nums tracking-tight" style={{ transform: "skewX(-7deg)" }}>
                  {scoreLabel}
                </span>
                <span className="flex gap-2 lg:justify-end">
                  <Link href={`/admin/fixtures/${fixture.id}/lineup`} className={ADMIN_ROW_ACTION}>
                    {done ? "Lineup" : "Build lineup"}
                  </Link>
                  <Link href={`/admin/fixtures/${fixture.id}/edit`} className={ADMIN_ROW_ACTION}>
                    Edit
                  </Link>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
