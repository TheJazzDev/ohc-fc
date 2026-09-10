export type NextMatch = {
  opponent: string;
  date: string;
  time: string;
  competition: string;
};

export type StandingsSnapshot = {
  position: string;
  points: number;
  division: string;
};

export type LastResult = {
  opponent: string;
  competition: string;
  venue: "HOME" | "AWAY";
  date: string;
  us: number;
  them: number;
  scorers: string;
};
