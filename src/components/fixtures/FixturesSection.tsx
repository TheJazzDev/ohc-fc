"use client";

import { useState } from "react";
import { FixtureRow } from "./FixtureRow";
import { FixturesLegend } from "./FixturesLegend";
import { LeagueTable } from "./LeagueTable";
import { ResultRow } from "./ResultRow";
import type { MatchResult, TableRow, UpcomingFixture } from "./types";

type Tab = "upcoming" | "results" | "table";

const TABS: { key: Tab; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "results", label: "Results" },
  { key: "table", label: "Table" },
];

const PANEL_CUT = "[clip-path:polygon(0_0,100%_0,100%_100%,32px_100%,0_calc(100%-32px))]";

export function FixturesSection({
  upcoming,
  results,
  table,
}: {
  upcoming: UpcomingFixture[];
  results: MatchResult[];
  table: TableRow[];
}) {
  const [tab, setTab] = useState<Tab>("upcoming");

  return (
    <>
      <div
        className={`animate-reveal-up relative flex flex-col gap-6 rounded-md border border-fg/10 bg-surface-2/70 p-6 shadow-raised backdrop-blur-sm lg:col-start-1 lg:row-start-1 lg:row-span-3 ${PANEL_CUT}`}
      >
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            2026/27 Season
          </span>
          <h1 className="font-heading text-4xl leading-[0.95] font-bold tracking-tight uppercase sm:text-5xl lg:text-6xl">
            Fixtures &amp; Results
          </h1>
        </div>

        <div className="grid w-full grid-cols-3 gap-1 rounded-md border border-fg/10 bg-surface-2 p-1 lg:inline-grid lg:w-auto lg:grid-flow-col">
          {TABS.map((t) => {
            const isActive = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`h-10 cursor-pointer rounded-md font-heading text-sm font-semibold tracking-wider uppercase outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent lg:h-9 lg:px-5 ${
                  isActive ? "bg-fg text-surface" : "text-muted"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <FixturesLegend />
      </div>

      <div className="flex flex-col gap-2 lg:col-start-2 lg:row-start-1 lg:row-span-3">
        {tab === "upcoming" &&
          (upcoming.length === 0 ? (
            <p className="px-1 text-sm text-muted">No fixtures scheduled yet.</p>
          ) : (
            upcoming.map((fixture, index) => <FixtureRow key={fixture.id} fixture={fixture} delayMs={index * 70} />)
          ))}
        {tab === "results" &&
          (results.length === 0 ? (
            <p className="px-1 text-sm text-muted">No results yet.</p>
          ) : (
            results.map((result, index) => <ResultRow key={result.id} result={result} delayMs={index * 70} />)
          ))}
        {tab === "table" && (
          <>
            <p className="px-1 text-xs text-muted uppercase tracking-[0.1em]">Placeholder data</p>
            <LeagueTable rows={table} />
          </>
        )}
      </div>
    </>
  );
}
