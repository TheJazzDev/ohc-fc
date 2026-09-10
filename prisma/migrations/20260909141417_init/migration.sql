-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GK', 'DF', 'MF', 'FW');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('FIRST_TEAM', 'RESERVE');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "position" "Position" NOT NULL,
    "status" "PlayerStatus" NOT NULL DEFAULT 'FIRST_TEAM',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "photoUrl" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_number_key" ON "Player"("number");
