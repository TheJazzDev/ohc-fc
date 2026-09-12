"use server";

import { z } from "zod";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { isManagedPhotoUrl } from "@/lib/image/photo-upload";
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
  // An empty field means "no photo" — store null, not "".
  photoUrl: z
    .string()
    .optional()
    .transform((value) => (value && value.trim() ? value.trim() : null)),
});

/**
 * Drops a photo we uploaded once it is no longer referenced — on removal and
 * on replacement alike. Runs after the record is saved, and never fails the
 * save: an orphaned file is a much smaller problem than a lost edit.
 */
async function discardReplacedPhoto(previous: string | null, next: string | null) {
  if (!previous || previous === next || !isManagedPhotoUrl(previous)) return;
  try {
    // Pass the token explicitly: left to its own devices the SDK reaches for
    // OIDC and fails outside a Vercel-hosted runtime.
    await del(previous, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch (cause) {
    console.error("[players] could not delete replaced photo:", cause);
  }
}

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

  const before = await prisma.player.findUnique({ where: { id }, select: { photoUrl: true } });
  await prisma.player.update({ where: { id }, data: parsed.data });
  await discardReplacedPhoto(before?.photoUrl ?? null, parsed.data.photoUrl);

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
