"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Position } from "@/components/squad/types";
import { ADMIN_BUTTON_PRIMARY, ADMIN_CARD, ADMIN_EYEBROW, ADMIN_H1, ADMIN_ROW_ACTION, ADMIN_TABLE_HEAD_CELL } from "./admin-ui";
import { DeactivatePlayerButton } from "./DeactivatePlayerButton";

export type AdminPlayerRow = {
  id: string;
  number: number;
  name: string;
  position: Position;
  status: "FIRST_TEAM" | "RESERVE";
  bio: string | null;
  photoUrl: string | null;
};

export function AdminPlayersView({ players }: { players: AdminPlayerRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter((player) => player.name.toLowerCase().includes(q) || String(player.number) === q);
  }, [players, query]);

  const stats = useMemo(
    () => [
      { label: "ON THE ROSTER", value: players.length, accent: false },
      { label: "FIRST TEAM", value: players.filter((p) => p.status === "FIRST_TEAM").length, accent: true },
      { label: "RESERVE", value: players.filter((p) => p.status === "RESERVE").length, accent: false },
      { label: "MISSING A PHOTO", value: players.filter((p) => !p.photoUrl).length, accent: false },
    ],
    [players],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5">
          <span className={ADMIN_EYEBROW}>SQUAD MANAGEMENT · 2026/27</span>
          <h1 className={ADMIN_H1}>Players</h1>
        </div>
        <div className="flex w-full items-center gap-2.5 sm:w-auto">
          <div className="flex h-[38px] flex-1 items-center gap-2 rounded-md border border-fg/12 bg-surface-2 px-3 text-muted sm:w-[260px] sm:flex-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search players"
              className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            />
          </div>
          <Link href="/admin/players/new" className={ADMIN_BUTTON_PRIMARY}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add player
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${ADMIN_CARD} flex flex-col gap-1.5 p-4 sm:p-[18px]`}>
            <span className={ADMIN_TABLE_HEAD_CELL}>{stat.label}</span>
            <span className={`font-heading text-2xl leading-none font-bold tabular-nums sm:text-[28px] ${stat.accent ? "text-accent" : "text-fg"}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-md border border-fg/10 bg-surface-2">
        <div className="hidden grid-cols-[72px_minmax(0,1.6fr)_120px_120px_minmax(0,2fr)_150px] items-center gap-4 border-b border-fg/10 px-5 py-2.5 lg:grid">
          <span className={ADMIN_TABLE_HEAD_CELL}>No.</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Name</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Position</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Status</span>
          <span className={ADMIN_TABLE_HEAD_CELL}>Bio</span>
          <span className={`${ADMIN_TABLE_HEAD_CELL} text-right`}>Actions</span>
        </div>

        {filtered.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">No players match &ldquo;{query}&rdquo;.</p>
        ) : (
          filtered.map((player) => (
            <div
              key={player.id}
              className="flex flex-col gap-2 border-b border-fg/6 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[oklch(0.24_0.015_260)] lg:grid lg:grid-cols-[72px_minmax(0,1.6fr)_120px_120px_minmax(0,2fr)_150px] lg:items-center lg:gap-4 lg:py-0 lg:min-h-14"
            >
              <span className="font-heading text-lg font-bold tabular-nums tracking-tight text-accent" style={{ transform: "skewX(-7deg)" }}>
                {player.number}
              </span>
              <span className="font-heading text-base leading-tight font-semibold sm:text-[17px]">{player.name}</span>
              <span className="inline-flex h-6 w-fit items-center rounded-md border border-accent/35 px-2 font-heading text-[11px] font-semibold tracking-[0.1em] uppercase">
                {player.position}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-muted">
                <span
                  className={`h-[7px] w-[7px] rounded-full border-[1.5px] ${player.status === "FIRST_TEAM" ? "border-accent bg-accent" : "border-muted bg-transparent"}`}
                />
                {player.status === "FIRST_TEAM" ? "First team" : "Reserve"}
              </span>
              <span className="truncate text-[13px] leading-relaxed text-muted">{player.bio || "—"}</span>
              <span className="flex gap-2 lg:justify-end">
                <Link href={`/admin/players/${player.id}/edit`} className={ADMIN_ROW_ACTION}>
                  Edit
                </Link>
                <DeactivatePlayerButton id={player.id} name={player.name} />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
