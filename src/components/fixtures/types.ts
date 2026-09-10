export type UpcomingFixture = {
  id: string;
  date: string;
  time: string;
  opponent: string;
  competition: string;
  home: boolean;
};

export type MatchResult = {
  id: string;
  date: string;
  opponent: string;
  competition: string;
  home: boolean;
  us: number;
  them: number;
};

export type TableRow = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
};
