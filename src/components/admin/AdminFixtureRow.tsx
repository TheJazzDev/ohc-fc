import Link from "next/link";
import { formatShortDate, formatTime } from "@/lib/format-kickoff";

type FixtureRowData = {
  id: string;
  opponent: string;
  competition: string;
  kickoff: Date;
  venue: "HOME" | "AWAY";
  ourScore: number | null;
  theirScore: number | null;
  lineupAnnounced: boolean;
};

export function AdminFixtureRow({ fixture }: { fixture: FixtureRowData }) {
  const scoreLabel = fixture.ourScore != null && fixture.theirScore != null ? `${fixture.ourScore}–${fixture.theirScore}` : null;

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-fg/10 bg-surface-2 px-3.5 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:text-base">
      <span className="flex flex-wrap items-center gap-2">
        <span className="font-heading font-bold">
          {fixture.venue === "HOME" ? "vs" : "@"} {fixture.opponent}
        </span>
        <span className="text-xs text-muted uppercase">{fixture.competition}</span>
        <span className="text-xs text-muted">
          {formatShortDate(fixture.kickoff)} · {formatTime(fixture.kickoff)}
        </span>
        {scoreLabel && <span className="font-heading text-xs font-bold text-accent">{scoreLabel}</span>}
        {fixture.lineupAnnounced && <span className="text-xs text-muted uppercase">Lineup set</span>}
      </span>
      <span className="flex items-center gap-3">
        <Link href={`/admin/fixtures/${fixture.id}/lineup`} className="text-muted no-underline hover:text-accent">
          Lineup
        </Link>
        <Link href={`/admin/fixtures/${fixture.id}/edit`} className="text-muted no-underline hover:text-accent">
          Edit
        </Link>
      </span>
    </li>
  );
}
