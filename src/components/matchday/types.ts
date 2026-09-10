import type { Position } from "@/components/squad/types";
import type { Formation } from "./formations";

export type LineupSlotView = { slotIndex: number; label: string; number: number; name: string };

export type BenchPlayer = { number: number; name: string; pos: Position };

export type MatchInfo = {
  competition: string;
  round: string | null;
  venue: "HOME" | "AWAY";
  opponent: string;
  date: string;
  time: string;
  ground: string;
  formation: Formation;
  announced: boolean;
};
