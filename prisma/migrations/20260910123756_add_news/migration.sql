-- CreateEnum
CREATE TYPE "NewsKind" AS ENUM ('CLUB_NEWS', 'MATCH_REPORT');

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "NewsKind" NOT NULL DEFAULT 'CLUB_NEWS',
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "byline" TEXT,
    "competition" TEXT,
    "ourScore" INTEGER,
    "theirScore" INTEGER,
    "startingXi" TEXT,
    "subs" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");
