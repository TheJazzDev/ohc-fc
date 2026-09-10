import { notFound } from "next/navigation";
import { getFixture } from "@/actions/fixtures";
import { listPlayers } from "@/actions/players";
import { saveLineup } from "@/actions/lineups";
import { AdminLineupBuilder, type LineupInitial } from "@/components/admin/AdminLineupBuilder";
import { formatLongDate, formatTime } from "@/lib/format-kickoff";

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

  const initial: LineupInitial = {
    formation: fixture.formation,
    announced: fixture.lineupAnnounced,
    starters,
    bench,
  };

  const ground = fixture.venue === "HOME" ? fixture.ground || "Pearson Park" : fixture.ground || "Away";
  const matchMeta = `${formatLongDate(fixture.kickoff)} · ${formatTime(fixture.kickoff)} · ${fixture.competition}${
    fixture.round ? `, ${fixture.round.toLowerCase()}` : ""
  } · ${ground}`;

  const boundSave = saveLineup.bind(null, id);

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminLineupBuilder
        players={players.map((player) => ({
          id: player.id,
          number: player.number,
          name: player.name,
          position: player.position,
        }))}
        initial={initial}
        matchTitle={`vs ${fixture.opponent}`}
        matchMeta={matchMeta}
        action={boundSave}
      />
    </div>
  );
}
