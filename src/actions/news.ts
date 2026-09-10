"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseLondonDateTimeLocal } from "@/lib/format-kickoff";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const NewsArticleSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(SLUG_PATTERN, "Slug must be lowercase, hyphen-separated"),
    kind: z.enum(["CLUB_NEWS", "MATCH_REPORT"]),
    excerpt: z.string().min(1, "Excerpt is required"),
    body: z.string().min(1, "Body is required"),
    byline: z.string().optional(),
    publishedAtLocal: z.string().min(1, "Published date is required"),
    published: z.string().optional(),
    competition: z.string().optional(),
    ourScore: z.string().optional(),
    theirScore: z.string().optional(),
    startingXi: z.string().optional(),
    subs: z.string().optional(),
  })
  .refine((data) => data.kind !== "MATCH_REPORT" || (data.ourScore && data.theirScore), {
    message: "Match reports need both scores",
    path: ["ourScore"],
  });

function revalidateNewsPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/news");
  if (slug) revalidatePath(`/news/${slug}`);
}

function toNullableInt(value?: string) {
  if (!value || !value.trim()) return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

function articleData(parsed: z.infer<typeof NewsArticleSchema>) {
  const isMatchReport = parsed.kind === "MATCH_REPORT";
  return {
    title: parsed.title,
    slug: parsed.slug,
    kind: parsed.kind,
    excerpt: parsed.excerpt,
    body: parsed.body,
    byline: parsed.byline || null,
    publishedAt: parseLondonDateTimeLocal(parsed.publishedAtLocal),
    published: parsed.published === "on",
    competition: isMatchReport ? parsed.competition || null : null,
    ourScore: isMatchReport ? toNullableInt(parsed.ourScore) : null,
    theirScore: isMatchReport ? toNullableInt(parsed.theirScore) : null,
    startingXi: isMatchReport ? parsed.startingXi || null : null,
    subs: isMatchReport ? parsed.subs || null : null,
  };
}

export async function listPublishedNews() {
  return prisma.newsArticle.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

export async function getPublishedArticle(slug: string) {
  return prisma.newsArticle.findFirst({ where: { slug, published: true } });
}

export async function listAdminNews() {
  return prisma.newsArticle.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getAdminArticle(id: string) {
  return prisma.newsArticle.findUnique({ where: { id } });
}

export async function createNewsArticle(_prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = NewsArticleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const duplicate = await prisma.newsArticle.findUnique({ where: { slug: parsed.data.slug } });
  if (duplicate) return "An article with this slug already exists";

  await prisma.newsArticle.create({ data: articleData(parsed.data) });

  revalidateNewsPaths(parsed.data.slug);
  redirect("/admin/news");
}

export async function updateNewsArticle(id: string, _prevState: string | null, formData: FormData) {
  const session = await auth();
  if (!session) return "Unauthorized";

  const parsed = NewsArticleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0].message;

  const duplicate = await prisma.newsArticle.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (duplicate) return "An article with this slug already exists";

  await prisma.newsArticle.update({ where: { id }, data: articleData(parsed.data) });

  revalidateNewsPaths(parsed.data.slug);
  redirect("/admin/news");
}

export async function deleteNewsArticle(id: string) {
  const session = await auth();
  if (!session) return;

  await prisma.newsArticle.delete({ where: { id } });
  revalidateNewsPaths();
  redirect("/admin/news");
}
