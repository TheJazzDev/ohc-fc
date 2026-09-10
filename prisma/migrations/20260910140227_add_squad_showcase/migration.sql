-- CreateTable
CREATE TABLE "SquadShowcase" (
    "id" TEXT NOT NULL,
    "formation" TEXT NOT NULL DEFAULT '4-3-3',
    "live" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SquadShowcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadShowcaseSlot" (
    "id" TEXT NOT NULL,
    "showcaseId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "SquadShowcaseSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SquadShowcaseSlot_showcaseId_playerId_key" ON "SquadShowcaseSlot"("showcaseId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "SquadShowcaseSlot_showcaseId_slotIndex_key" ON "SquadShowcaseSlot"("showcaseId", "slotIndex");

-- AddForeignKey
ALTER TABLE "SquadShowcaseSlot" ADD CONSTRAINT "SquadShowcaseSlot_showcaseId_fkey" FOREIGN KEY ("showcaseId") REFERENCES "SquadShowcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadShowcaseSlot" ADD CONSTRAINT "SquadShowcaseSlot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
