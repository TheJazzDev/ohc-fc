import { createPlayer } from "@/actions/players";
import { PlayerForm } from "@/components/admin/PlayerForm";

export default function NewPlayerPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-heading text-xl font-bold uppercase sm:text-2xl">Add player</h1>
      <PlayerForm action={createPlayer} />
    </div>
  );
}
