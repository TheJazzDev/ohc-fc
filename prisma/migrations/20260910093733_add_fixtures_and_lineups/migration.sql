-- CreateEnum
CREATE TYPE "Venue" AS ENUM ('HOME', 'AWAY');

-- CreateEnum
CREATE TYPE "FixtureStatus" AS ENUM ('SCHEDULED', 'PLAYED', 'POSTPONED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LineupRole" AS ENUM ('STARTER', 'BENCH');

-- CreateTable
CREATE TABLE "Fixture" (
    "id" TEXT NOT NULL,
    "opponent" TEXT NOT NULL,
    "competition" TEXT NOT NULL,
    "round" TEXT,
    "kickoff" TIMESTAMP(3) NOT NULL,
    "venue" "Venue" NOT NULL DEFAULT 'HOME',
    "ground" TEXT,
    "formation" TEXT NOT NULL DEFAULT '4-3-3',
    "lineupAnnounced" BOOLEAN NOT NULL DEFAULT false,
    "status" "FixtureStatus" NOT NULL DEFAULT 'SCHEDULED',
    "ourScore" INTEGER,
    "theirScore" INTEGER,
    "scorers" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineupSlot" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "role" "LineupRole" NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "LineupSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fixture_kickoff_opponent_key" ON "Fixture"("kickoff", "opponent");

-- CreateIndex
CREATE UNIQUE INDEX "LineupSlot_fixtureId_playerId_key" ON "LineupSlot"("fixtureId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "LineupSlot_fixtureId_role_slotIndex_key" ON "LineupSlot"("fixtureId", "role", "slotIndex");

-- AddForeignKey
ALTER TABLE "LineupSlot" ADD CONSTRAINT "LineupSlot_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineupSlot" ADD CONSTRAINT "LineupSlot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
