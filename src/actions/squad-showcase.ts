"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { formationSlots, isFormation } from "@/components/matchday/formations";
import { findDuplicatePlayer } from "@/lib/validation/fixture";

export type SquadShowcaseAdminState = {
  formation: string;
  live: boolean;
  starters: (string | undefined)[];
};

export async function getSquadShowcaseForAdmin(): Promise<SquadShowcaseAdminState> {
  const showcase = await prisma.squadShowcase.findFirst({
    include: { slots: { orderBy: { slotIndex: "asc" } } },
  });
  if (!showcase) return { formation: "4-3-3", live: false, starters: [] };

  const starters: (string | undefined)[] = [];
  for (const slot of showcase.slots) starters[slot.slotIndex] = slot.playerId;
  return { formation: showcase.formation, live: showcase.live, starters };
}

export type SquadShowcasePublic = { formation: string; starterIds: (string | undefined)[] };

export async function getSquadShowcaseForHome(): Promise<SquadShowcasePublic | null> {
  const showcase = await prisma.squadShowcase.findFirst({
    where: { live: true },
    include: { slots: { orderBy: { slotIndex: "asc" } } },
  });
  if (!showcase) return null;

  const starterIds: (string | undefined)[] = [];
  for (const slot of showcase.slots) starterIds[slot.slotIndex] = slot.playerId;
  return { formation: showcase.formation, starterIds };
}

export async function saveSquadShowcase(_prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const formationRaw = formData.get("formation");
  const formation = typeof formationRaw === "string" && isFormation(formationRaw) ? formationRaw : "4-3-3";
  const slots = formationSlots(formation);

  const starterIds = slots.map((_, index) => {
    const value = formData.get(`slot-${index}`);
    return typeof value === "string" && value ? value : undefined;
  });

  const live = formData.get("live") === "on";

  // A part-filled XI publishes fine — the homepage draws the unfilled spots as
  // TBC, which is the point of the showcase while the squad comes together.
  const filledStarterIds = starterIds.filter((id): id is string => !!id);
  const duplicate = findDuplicatePlayer(filledStarterIds);
  if (duplicate) return "A player can only appear once in the showcase";

  await prisma.$transaction(async (tx) => {
    const existing = await tx.squadShowcase.findFirst();
    const showcase = existing
      ? await tx.squadShowcase.update({ where: { id: existing.id }, data: { formation, live } })
      : await tx.squadShowcase.create({ data: { formation, live } });

    await tx.squadShowcaseSlot.deleteMany({ where: { showcaseId: showcase.id } });

    const rows = starterIds.flatMap((playerId, index) =>
      playerId ? [{ showcaseId: showcase.id, playerId, slotIndex: index, label: slots[index].label }] : [],
    );
    if (rows.length > 0) {
      await tx.squadShowcaseSlot.createMany({ data: rows });
    }
  });

  revalidatePath("/admin/showcase");
  revalidatePath("/");
  return null;
}
