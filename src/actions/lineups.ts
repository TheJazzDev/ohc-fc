"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formationSlots, isFormation } from "@/components/matchday/formations";
import { findDuplicatePlayer, isBenchOverfilled } from "@/lib/validation/fixture";

function revalidateFixturePaths() {
  revalidatePath("/admin/fixtures");
  revalidatePath("/");
  revalidatePath("/fixtures");
  revalidatePath("/matchday");
}

export async function saveLineup(fixtureId: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const formationRaw = formData.get("formation");
  const formation = typeof formationRaw === "string" && isFormation(formationRaw) ? formationRaw : "4-3-3";
  const slots = formationSlots(formation);

  const starterIds = slots.map((_, index) => {
    const value = formData.get(`slot-${index}`);
    return typeof value === "string" && value ? value : undefined;
  });

  const benchIds = formData.getAll("bench").filter((value): value is string => typeof value === "string" && value.length > 0);

  const announced = formData.get("announced") === "on";

  if (announced && starterIds.some((id) => !id)) {
    return "Fill every starting slot before announcing the lineup";
  }

  const filledStarterIds = starterIds.filter((id): id is string => !!id);
  const duplicate = findDuplicatePlayer([...filledStarterIds, ...benchIds]);
  if (duplicate) return "A player can only appear once in the lineup";

  if (isBenchOverfilled(benchIds)) return "Bench is limited to 7 players";

  await prisma.$transaction(async (tx) => {
    await tx.lineupSlot.deleteMany({ where: { fixtureId } });

    const starterRows = starterIds.flatMap((playerId, index) =>
      playerId
        ? [{ fixtureId, playerId, role: "STARTER" as const, slotIndex: index, label: slots[index].label }]
        : [],
    );
    const benchRows = benchIds.map((playerId, index) => ({
      fixtureId,
      playerId,
      role: "BENCH" as const,
      slotIndex: index,
      label: "SUB",
    }));

    if (starterRows.length + benchRows.length > 0) {
      await tx.lineupSlot.createMany({ data: [...starterRows, ...benchRows] });
    }

    await tx.fixture.update({ where: { id: fixtureId }, data: { formation, lineupAnnounced: announced } });
  });

  revalidateFixturePaths();
  redirect("/admin/fixtures");
}
