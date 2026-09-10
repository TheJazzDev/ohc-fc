import { formatLongDate, formatShortDate, formatTime } from "@/lib/format-kickoff";
import type { LastResult, NextMatch } from "./types";

type DbNextFixture = { opponent: string; competition: string; kickoff: Date };

type DbResultFixture = {
  opponent: string;
  competition: string;
  kickoff: Date;
  venue: "HOME" | "AWAY";
  ourScore: number | null;
  theirScore: number | null;
  scorers: string | null;
};

export function mapNextMatch(fixture: DbNextFixture): NextMatch {
  return {
    opponent: fixture.opponent,
    date: formatLongDate(fixture.kickoff),
    time: formatTime(fixture.kickoff),
    competition: fixture.competition,
  };
}

export function mapLastResult(fixture: DbResultFixture): LastResult {
  return {
    opponent: fixture.opponent,
    competition: fixture.competition,
    venue: fixture.venue,
    date: formatShortDate(fixture.kickoff),
    us: fixture.ourScore ?? 0,
    them: fixture.theirScore ?? 0,
    scorers: fixture.scorers ?? "",
  };
}
