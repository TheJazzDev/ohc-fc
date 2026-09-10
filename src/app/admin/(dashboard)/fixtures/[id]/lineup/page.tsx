import { notFound } from "next/navigation";
import { getFixture } from "@/actions/fixtures";
import { listPlayers } from "@/actions/players";
import { LineupPicker, type InitialLineup } from "@/components/admin/LineupPicker";

export default async function FixtureLineupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [fixture, players] = await Promise.all([getFixture(id), listPlayers()]);
  if (!fixture) notFound();

  const starters: (string | undefined)[] = Array(11).fill(undefined);
  for (const slot of fixture.slots) {
    if (slot.role === "STARTER" && slot.slotIndex >= 0 && slot.slotIndex < 11) {
      starters[slot.slotIndex] = slot.playerId;
    }
  }
  const bench = fixture.slots
    .filter((slot) => slot.role === "BENCH")
    .sort((a, b) => a.slotIndex - b.slotIndex)
    .map((slot) => slot.playerId);

  const initial: InitialLineup = {
    formation: fixture.formation,
    announced: fixture.lineupAnnounced,
    starters,
    bench,
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 font-heading text-xl font-bold uppercase sm:text-2xl">Lineup</h1>
      <p className="mb-6 text-sm text-muted">
        vs {fixture.opponent} · {fixture.competition}
      </p>
      <LineupPicker
        fixtureId={id}
        players={players.map((player) => ({
          id: player.id,
          number: player.number,
          name: player.name,
          position: player.position,
        }))}
        initial={initial}
      />
    </div>
  );
}
