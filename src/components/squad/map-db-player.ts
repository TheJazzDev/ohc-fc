import { initialsFromName } from "@/lib/initials";
import type { Player } from "./types";

type DbPlayer = {
  number: number;
  name: string;
  position: string;
  bio: string | null;
  photoUrl: string | null;
};

export function mapDbPlayer(player: DbPlayer): Player {
  return {
    number: player.number,
    name: player.name,
    pos: player.position as Player["pos"],
    initials: initialsFromName(player.name),
    bio: player.bio ?? "",
    photoUrl: player.photoUrl,
  };
}
