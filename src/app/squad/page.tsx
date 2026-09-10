import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Grain } from "@/components/atmosphere/Grain";
import { LightBeams } from "@/components/atmosphere/LightBeams";
import { SquadSection } from "@/components/squad/SquadSection";
import { mapDbPlayer } from "@/components/squad/map-db-player";
import { listPlayers } from "@/actions/players";

export default async function SquadPage() {
  const players = await listPlayers();
  const roster = players.map(mapDbPlayer);

  return (
    <>
      <SiteHeader active="Squad" />
      <div className="relative flex-1 overflow-hidden bg-[radial-gradient(120%_90%_at_25%_0%,oklch(0.215_0.018_260)_0%,oklch(0.16_0.01_260)_58%,oklch(0.13_0.01_260)_100%)]">
        <LightBeams />
        <Grain opacity={0.4} />
        <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
          <SquadSection roster={roster} />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
