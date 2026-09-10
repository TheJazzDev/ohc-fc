"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseLondonDateTimeLocal } from "@/lib/format-kickoff";
import { mapMatchResult, mapUpcomingFixture } from "@/components/fixtures/map-db-fixture";
import { mapBench, mapMatchInfo, mapStarters } from "@/components/matchday/map-db-match";
import { mapLastResult, mapNextMatch } from "@/components/home/map-db-home";
import { COMPETITIONS } from "@/lib/competitions";

const FixtureSchema = z.object({
  opponent: z.string().min(1, "Opponent is required"),
  competition: z.enum(COMPETITIONS),
  round: z.string().optional(),
  kickoffLocal: z.string().min(1, "Kickoff date and time is required"),
  venue: z.enum(["HOME", "AWAY"]),
  ground: z.string().optional(),
});

const ResultSchema = z.object({
  status: z.enum(["SCHEDULED", "PLAYED", "POSTPONED", "CANCELLED"]),
  ourScore: z.string().optional(),
  theirScore: z.string().optional(),
  scorers: z.string().optional(),
});

const SLOTS_INCLUDE = { slots: { include: { player: true } } } as const;

function revalidateFixturePaths() {
  revalidatePath("/admin/fixtures");
  revalidatePath("/");
  revalidatePath("/fixtures");
  revalidatePath("/matchday");
}

export async function listUpcomingFixtures() {
  const fixtures = await prisma.fixture.findMany({
    where: { status: "SCHEDULED", kickoff: { gte: new Date() } },
    orderBy: { kickoff: "asc" },
  });
  return fixtures.map(mapUpcomingFixture);
}

export async function listResults() {
  const fixtures = await prisma.fixture.findMany({
    where: { status: "PLAYED" },
    orderBy: { kickoff: "desc" },
  });
  return fixtures.map(mapMatchResult);
}

export async function getNextFixture() {
  const fixture = await prisma.fixture.findFirst({
    where: { status: "SCHEDULED", kickoff: { gte: new Date() } },
    orderBy: { kickoff: "asc" },
    include: SLOTS_INCLUDE,
  });
  if (!fixture) return null;

  return {
    match: mapMatchInfo(fixture),
    starters: mapStarters(fixture.slots),
    bench: mapBench(fixture.slots),
  };
}

export async function getLastResult() {
  const fixture = await prisma.fixture.findFirst({
    where: { status: "PLAYED" },
    orderBy: { kickoff: "desc" },
  });
  return fixture ? mapLastResult(fixture) : null;
}

export async function getUpcomingForHome() {
  const fixture = await prisma.fixture.findFirst({
    where: { status: "SCHEDULED", kickoff: { gte: new Date() } },
    orderBy: { kickoff: "asc" },
  });
  return fixture ? mapNextMatch(fixture) : null;
}

export async function listAdminFixtures() {
  return prisma.fixture.findMany({ orderBy: { kickoff: "desc" } });
}

export async function getFixture(id: string) {
  return prisma.fixture.findUnique({ where: { id }, include: SLOTS_INCLUDE });
}

export async function createFixture(_prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = FixtureSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const kickoff = parseLondonDateTimeLocal(parsed.data.kickoffLocal);

  const duplicate = await prisma.fixture.findFirst({
    where: { kickoff, opponent: parsed.data.opponent },
  });
  if (duplicate) return "A fixture against this opponent at this kickoff already exists";

  const fixture = await prisma.fixture.create({
    data: {
      opponent: parsed.data.opponent,
      competition: parsed.data.competition,
      round: parsed.data.round || null,
      kickoff,
      venue: parsed.data.venue,
      ground: parsed.data.ground || null,
    },
  });

  revalidateFixturePaths();
  redirect(formData.get("intent") === "lineup" ? `/admin/fixtures/${fixture.id}/lineup` : "/admin/fixtures");
}

export async function updateFixture(id: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = FixtureSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const kickoff = parseLondonDateTimeLocal(parsed.data.kickoffLocal);

  const duplicate = await prisma.fixture.findFirst({
    where: { kickoff, opponent: parsed.data.opponent, NOT: { id } },
  });
  if (duplicate) return "A fixture against this opponent at this kickoff already exists";

  await prisma.fixture.update({
    where: { id },
    data: {
      opponent: parsed.data.opponent,
      competition: parsed.data.competition,
      round: parsed.data.round || null,
      kickoff,
      venue: parsed.data.venue,
      ground: parsed.data.ground || null,
    },
  });

  revalidateFixturePaths();
  redirect(formData.get("intent") === "lineup" ? `/admin/fixtures/${id}/lineup` : "/admin/fixtures");
}

export async function saveResult(id: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = ResultSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const ourScoreRaw = parsed.data.ourScore?.trim();
  const theirScoreRaw = parsed.data.theirScore?.trim();
  const ourScore = ourScoreRaw ? Number(ourScoreRaw) : null;
  const theirScore = theirScoreRaw ? Number(theirScoreRaw) : null;

  if ((ourScoreRaw && !Number.isInteger(ourScore)) || (theirScoreRaw && !Number.isInteger(theirScore))) {
    return "Scores must be whole numbers";
  }
  if (parsed.data.status === "PLAYED" && (ourScore === null || theirScore === null)) {
    return "Enter both scores to mark this fixture as played";
  }

  await prisma.fixture.update({
    where: { id },
    data: {
      status: parsed.data.status,
      ourScore,
      theirScore,
      scorers: parsed.data.scorers || null,
    },
  });

  revalidateFixturePaths();
  redirect("/admin/fixtures");
}

export async function deleteFixture(id: string) {
  const session = await auth();
  if (!session) return;

  await prisma.fixture.delete({ where: { id } });
  revalidateFixturePaths();
  redirect("/admin/fixtures");
}
