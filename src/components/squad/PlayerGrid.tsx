import { PlayerFlipCard } from "./PlayerFlipCard";
import type { Player } from "./types";

export function PlayerGrid({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-fg/15 px-6 py-16 text-center">
        <span className="font-heading text-lg font-semibold uppercase">No players match yet</span>
        <p className="m-0 max-w-xs text-sm text-muted">Try a different filter, or check back once more of the squad is confirmed.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
      {players.map((player, index) => (
        <div key={player.number} className="animate-reveal-up" style={{ animationDelay: `${(index % 10) * 70}ms` }}>
          <PlayerFlipCard
            name={player.name}
            number={player.number}
            pos={player.pos}
            initials={player.initials}
            bio={player.bio}
            photoUrl={player.photoUrl}
            titleSize={18}
          />
        </div>
      ))}
    </div>
  );
}
