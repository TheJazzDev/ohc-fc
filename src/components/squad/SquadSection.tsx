"use client";

import { useMemo, useState } from "react";
import { FilterPills } from "./FilterPills";
import { PlayerGrid } from "./PlayerGrid";
import { SquadSearch } from "./SquadSearch";
import type { Player, Position } from "./types";

const PANEL_CUT = "[clip-path:polygon(0_0,100%_0,100%_100%,32px_100%,0_calc(100%-32px))]";

export function SquadSection({ roster }: { roster: Player[] }) {
  const [filter, setFilter] = useState<"All" | Position>("All");
  const [query, setQuery] = useState("");

  const players = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roster.filter(
      (player) =>
        (filter === "All" || player.pos === filter) &&
        (!q || player.name.toLowerCase().includes(q) || String(player.number) === q),
    );
  }, [roster, filter, query]);

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[300px_1fr] lg:items-start lg:gap-10">
      <div
        className={`animate-reveal-up relative flex flex-col gap-5 rounded-md border border-fg/10 bg-surface-2/70 p-6 shadow-raised backdrop-blur-sm lg:sticky lg:top-6 ${PANEL_CUT}`}
      >
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            2026/27 · First Team
          </span>
          <h1 className="font-heading text-4xl leading-[0.95] font-bold tracking-tight uppercase sm:text-5xl lg:text-6xl">
            <span className="bg-[linear-gradient(100deg,var(--color-accent)_0%,var(--color-accent-amber)_100%)] bg-clip-text text-transparent">
              Squad
            </span>
          </h1>
        </div>

        <p className="hidden text-sm leading-relaxed text-muted lg:block">
          {roster.length === 0
            ? "The 2026/27 squad is just getting started — check back soon as players are confirmed."
            : `${roster.length} player${roster.length === 1 ? "" : "s"} confirmed for 2026/27. Eleven who start, the rest who wait, one badge.`}
        </p>

        <FilterPills active={filter} onChange={setFilter} />

        <div className="hidden lg:block">
          <SquadSearch value={query} onChange={setQuery} />
        </div>
      </div>

      <PlayerGrid players={players} />
    </div>
  );
}
