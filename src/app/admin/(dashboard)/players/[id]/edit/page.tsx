import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePlayer } from "@/actions/players";
import { PlayerForm } from "@/components/admin/PlayerForm";

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = await prisma.player.findUnique({ where: { id } });
  if (!player) notFound();

  const boundAction = updatePlayer.bind(null, id);

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-heading text-xl font-bold uppercase sm:text-2xl">Edit player</h1>
      <PlayerForm action={boundAction} initialValues={player} />
    </div>
  );
}
