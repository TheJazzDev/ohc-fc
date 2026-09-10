/*
  Warnings:

  - Added the required column `name` to the `AdminUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT;

-- Backfill existing admins with a name derived from their email local-part.
UPDATE "AdminUser" SET "name" = split_part("email", '@', 1) WHERE "name" IS NULL;

ALTER TABLE "AdminUser" ALTER COLUMN "name" SET NOT NULL;
