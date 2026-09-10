"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isNumberTaken } from "@/lib/validation/player";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const PlayerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  number: z.coerce.number().int().positive(),
  position: z.enum(["GK", "CB", "FB", "DM", "CM", "AM", "W", "ST"]),
  status: z.enum(["FIRST_TEAM", "RESERVE"]),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
});

export async function listPlayers() {
  return prisma.player.findMany({ where: { active: true }, orderBy: { number: "asc" } });
}

export async function createPlayer(_prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = PlayerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const existing = await prisma.player.findMany({ select: { id: true, number: true } });
  if (isNumberTaken(existing, parsed.data.number)) {
    return `Number ${parsed.data.number} is already taken`;
  }

  await prisma.player.create({ data: parsed.data });
  revalidatePath("/admin/players");
  revalidatePath("/");
  revalidatePath("/squad");
  redirect("/admin/players");
}

export async function updatePlayer(id: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = PlayerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const existing = await prisma.player.findMany({ select: { id: true, number: true } });
  if (isNumberTaken(existing, parsed.data.number, id)) {
    return `Number ${parsed.data.number} is already taken`;
  }

  await prisma.player.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/players");
  revalidatePath("/");
  revalidatePath("/squad");
  redirect("/admin/players");
}

export async function deactivatePlayer(id: string) {
  const session = await auth();
  if (!session) return;

  await prisma.player.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/players");
  revalidatePath("/");
  revalidatePath("/squad");
}
