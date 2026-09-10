import { getSquadShowcaseForAdmin, saveSquadShowcase } from "@/actions/squad-showcase";
import { listPlayers } from "@/actions/players";
import { AdminShowcaseBuilder, type ShowcaseInitial } from "@/components/admin/AdminShowcaseBuilder";

export default async function AdminShowcasePage() {
  const [showcase, players] = await Promise.all([getSquadShowcaseForAdmin(), listPlayers()]);

  const initial: ShowcaseInitial = {
    formation: showcase.formation,
    live: showcase.live,
    starters: showcase.starters,
  };

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminShowcaseBuilder
        players={players.map((player) => ({
          id: player.id,
          number: player.number,
          name: player.name,
          position: player.position,
        }))}
        initial={initial}
        action={saveSquadShowcase}
      />
    </div>
  );
}
