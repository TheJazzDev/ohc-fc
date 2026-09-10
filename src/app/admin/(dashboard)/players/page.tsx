import Link from "next/link";
import { listPlayers } from "@/actions/players";

export default async function AdminPlayersPage() {
  const players = await listPlayers();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold uppercase sm:text-2xl">Players</h1>
        <Link
          href="/admin/players/new"
          className="rounded-md bg-accent px-3.5 py-2 font-heading text-xs font-bold tracking-wide text-surface uppercase no-underline sm:text-sm"
        >
          Add player
        </Link>
      </div>

      {players.length === 0 ? (
        <p className="text-sm text-muted">No players yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between gap-3 rounded-md border border-fg/10 bg-surface-2 px-3.5 py-2.5 text-sm sm:text-base"
            >
              <span className="flex items-center gap-3">
                <span className="font-heading font-bold text-accent">#{player.number}</span>
                <span>{player.name}</span>
                <span className="text-xs text-muted uppercase">{player.position}</span>
              </span>
              <Link href={`/admin/players/${player.id}/edit`} className="text-muted no-underline hover:text-accent">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
