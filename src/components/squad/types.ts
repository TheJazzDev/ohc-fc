export type Position = "GK" | "CB" | "FB" | "DM" | "CM" | "AM" | "W" | "ST";

export type Player = {
  number: number;
  name: string;
  pos: Position;
  initials: string;
  bio: string;
  photoUrl: string | null;
};
