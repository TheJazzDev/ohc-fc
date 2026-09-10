"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseLondonDateTimeLocal } from "@/lib/format-kickoff";

const TrainingSessionSchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  startsAtLocal: z.string().min(1, "Date and time is required"),
  recurrence: z.enum(["ONE_OFF", "WEEKLY"]),
});

const HISTORY_LENGTH = 4;

function revalidateTrainingPaths(id?: string) {
  revalidatePath("/admin/trainings");
  if (id) revalidatePath(`/admin/trainings/${id}/attendance`);
}

export async function listTrainingSessions() {
  const [sessions, rosterSize] = await Promise.all([
    prisma.trainingSession.findMany({
      orderBy: { startsAt: "desc" },
      include: { attendance: { select: { status: true } } },
    }),
    prisma.player.count({ where: { active: true } }),
  ]);

  const now = Date.now();
  return {
    rosterSize,
    sessions: sessions.map((session) => ({
      ...session,
      presentCount: session.attendance.filter((row) => row.status === "PRESENT").length,
      markedCount: session.attendance.length,
      past: session.startsAt.getTime() < now,
    })),
  };
}

export async function getTrainingSession(id: string) {
  return prisma.trainingSession.findUnique({ where: { id } });
}

export async function getTrainingAttendance(id: string) {
  const [session, players, attendance] = await Promise.all([
    prisma.trainingSession.findUnique({ where: { id } }),
    prisma.player.findMany({ where: { active: true }, orderBy: { number: "asc" } }),
    prisma.trainingAttendance.findMany({ where: { sessionId: id } }),
  ]);
  if (!session) return null;

  const pastSessions = await prisma.trainingSession.findMany({
    where: { startsAt: { lt: session.startsAt } },
    orderBy: { startsAt: "desc" },
    take: HISTORY_LENGTH,
    include: { attendance: { select: { playerId: true, status: true } } },
  });

  const statusByPlayerId = new Map(attendance.map((row) => [row.playerId, row.status]));

  return {
    session,
    roster: players.map((player) => ({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
      status: statusByPlayerId.get(player.id) ?? "PENDING",
      history: pastSessions.map((past) => past.attendance.find((row) => row.playerId === player.id)?.status ?? "PENDING"),
    })),
  };
}

export async function createTrainingSession(_prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = TrainingSessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const created = await prisma.trainingSession.create({
    data: {
      title: parsed.data.title || null,
      location: parsed.data.location || null,
      notes: parsed.data.notes || null,
      startsAt: parseLondonDateTimeLocal(parsed.data.startsAtLocal),
      recurrence: parsed.data.recurrence,
    },
  });

  revalidateTrainingPaths();
  redirect(`/admin/trainings/${created.id}/attendance`);
}

export async function updateTrainingSession(id: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = TrainingSessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.trainingSession.update({
    where: { id },
    data: {
      title: parsed.data.title || null,
      location: parsed.data.location || null,
      notes: parsed.data.notes || null,
      startsAt: parseLondonDateTimeLocal(parsed.data.startsAtLocal),
      recurrence: parsed.data.recurrence,
    },
  });

  revalidateTrainingPaths(id);
  redirect(`/admin/trainings/${id}/attendance`);
}

export async function deleteTrainingSession(id: string) {
  const session = await auth();
  if (!session) return;

  await prisma.trainingSession.delete({ where: { id } });
  revalidateTrainingPaths();
  redirect("/admin/trainings");
}

export async function saveAttendance(sessionId: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const players = await prisma.player.findMany({ where: { active: true }, select: { id: true } });

  await prisma.$transaction(async (tx) => {
    for (const player of players) {
      const status = formData.get(`status-${player.id}`);

      if (status === "PRESENT" || status === "ABSENT") {
        await tx.trainingAttendance.upsert({
          where: { sessionId_playerId: { sessionId, playerId: player.id } },
          create: { sessionId, playerId: player.id, status, markedAt: new Date() },
          update: { status, markedAt: new Date() },
        });
      } else {
        await tx.trainingAttendance.deleteMany({ where: { sessionId, playerId: player.id } });
      }
    }
  });

  revalidateTrainingPaths(sessionId);
  redirect(`/admin/trainings/${sessionId}/attendance`);
}
