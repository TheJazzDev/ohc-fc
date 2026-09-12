import { formatLongDate, formatTime } from "@/lib/format-kickoff";
import { isFormation } from "./formations";
import type { BenchPlayer, LineupSlotView, MatchInfo } from "./types";

type DbSlot = {
  slotIndex: number;
  label: string;
  role: "STARTER" | "BENCH";
  player: { number: number; name: string; position: string; photoUrl: string | null };
};

type DbFixture = {
  opponent: string;
  competition: string;
  round: string | null;
  kickoff: Date;
  venue: "HOME" | "AWAY";
  ground: string | null;
  formation: string;
  lineupAnnounced: boolean;
};

export function mapMatchInfo(fixture: DbFixture): MatchInfo {
  return {
    competition: fixture.competition,
    round: fixture.round,
    venue: fixture.venue,
    opponent: fixture.opponent,
    date: formatLongDate(fixture.kickoff),
    time: formatTime(fixture.kickoff),
    ground: fixture.ground ?? (fixture.venue === "HOME" ? "Pearson Park" : "TBC"),
    formation: isFormation(fixture.formation) ? fixture.formation : "4-3-3",
    announced: fixture.lineupAnnounced,
  };
}

export function mapStarters(slots: DbSlot[]): LineupSlotView[] {
  return slots
    .filter((slot) => slot.role === "STARTER")
    .sort((a, b) => a.slotIndex - b.slotIndex)
    .map((slot) => ({
      slotIndex: slot.slotIndex,
      label: slot.label,
      number: slot.player.number,
      name: slot.player.name,
      photoUrl: slot.player.photoUrl,
    }));
}

export function mapBench(slots: DbSlot[]): BenchPlayer[] {
  return slots
    .filter((slot) => slot.role === "BENCH")
    .sort((a, b) => a.slotIndex - b.slotIndex)
    .map((slot) => ({
      number: slot.player.number,
      name: slot.player.name,
      pos: slot.player.position as BenchPlayer["pos"],
      photoUrl: slot.player.photoUrl,
    }));
}
