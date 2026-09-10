import { createPlayer } from "@/actions/players";
import { AdminPlayerForm } from "@/components/admin/AdminPlayerForm";

export default function NewPlayerPage() {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10 lg:mx-auto lg:max-w-app lg:px-10 lg:py-12">
      <AdminPlayerForm action={createPlayer} />
    </div>
  );
}
