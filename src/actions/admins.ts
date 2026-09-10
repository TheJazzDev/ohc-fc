"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const AdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function listAdmins() {
  return prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createAdmin(_prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = AdminSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const existing = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (existing) return "An admin with this email already exists";

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.adminUser.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash },
  });

  revalidatePath("/admin/admins");
  redirect("/admin/admins");
}

export async function deleteAdmin(id: string) {
  const session = await auth();
  if (!session?.user?.email) return;

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return;

  if (target.email === session.user.email) return "You can't remove your own admin account while signed in";

  const count = await prisma.adminUser.count();
  if (count <= 1) return "At least one admin account must remain";

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/admins");
}
