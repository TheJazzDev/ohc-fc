import { formatShortDate, formatTime } from "@/lib/format-kickoff";
import type { MatchResult, UpcomingFixture } from "./types";

type DbFixture = {
  id: string;
  opponent: string;
  competition: string;
  kickoff: Date;
  venue: "HOME" | "AWAY";
  ourScore: number | null;
  theirScore: number | null;
};

export function mapUpcomingFixture(fixture: DbFixture): UpcomingFixture {
  return {
    id: fixture.id,
    date: formatShortDate(fixture.kickoff),
    time: formatTime(fixture.kickoff),
    opponent: fixture.opponent,
    competition: fixture.competition,
    home: fixture.venue === "HOME",
  };
}

export function mapMatchResult(fixture: DbFixture): MatchResult {
  return {
    id: fixture.id,
    date: formatShortDate(fixture.kickoff),
    opponent: fixture.opponent,
    competition: fixture.competition,
    home: fixture.venue === "HOME",
    us: fixture.ourScore ?? 0,
    them: fixture.theirScore ?? 0,
  };
}
