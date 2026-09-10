import { listPlayers } from "@/actions/players";
import { AdminPlayersView } from "@/components/admin/AdminPlayersView";

export default async function AdminPlayersPage() {
  const players = await listPlayers();

  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminPlayersView players={players} />
    </div>
  );
}
