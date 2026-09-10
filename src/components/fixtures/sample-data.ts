import type { TableRow } from "./types";

// League table needs every other club's results, which nothing in this app sources yet.
// Placeholder until a real table is wired up — kept clearly labelled in the UI.
export const PLACEHOLDER_TABLE: TableRow[] = [
  { team: "Denholm Wanderers", played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 19, goalsAgainst: 7 },
  { team: "Ashby Celtic", played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 16, goalsAgainst: 9 },
  { team: "OHC FC", played: 8, won: 5, drawn: 3, lost: 0, goalsFor: 17, goalsAgainst: 8 },
  { team: "Thornbridge Athletic", played: 8, won: 5, drawn: 1, lost: 2, goalsFor: 15, goalsAgainst: 10 },
  { team: "Kingsbury Rovers", played: 8, won: 3, drawn: 3, lost: 2, goalsFor: 12, goalsAgainst: 11 },
  { team: "Marlow Town", played: 8, won: 3, drawn: 2, lost: 3, goalsFor: 13, goalsAgainst: 14 },
  { team: "Whitmore Park", played: 8, won: 2, drawn: 4, lost: 2, goalsFor: 9, goalsAgainst: 11 },
  { team: "Stanhope Borough", played: 8, won: 2, drawn: 2, lost: 4, goalsFor: 10, goalsAgainst: 15 },
  { team: "Eastfield United", played: 8, won: 1, drawn: 3, lost: 4, goalsFor: 8, goalsAgainst: 16 },
  { team: "Denby Athletic", played: 8, won: 0, drawn: 3, lost: 5, goalsFor: 6, goalsAgainst: 18 },
];
