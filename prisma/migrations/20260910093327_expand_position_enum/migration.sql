-- AlterEnum
-- Expands Position from the broad GK/DF/MF/FW codes to granular roles.
-- Existing rows on the old broad codes are remapped to a sensible default
-- within the new set (DF -> CB, MF -> CM, FW -> ST) so no data is lost.
BEGIN;
CREATE TYPE "Position_new" AS ENUM ('GK', 'CB', 'FB', 'DM', 'CM', 'AM', 'W', 'ST');
ALTER TABLE "Player" ALTER COLUMN "position" TYPE "Position_new" USING (
  CASE "position"::text
    WHEN 'DF' THEN 'CB'
    WHEN 'MF' THEN 'CM'
    WHEN 'FW' THEN 'ST'
    ELSE "position"::text
  END
)::"Position_new";
ALTER TYPE "Position" RENAME TO "Position_old";
ALTER TYPE "Position_new" RENAME TO "Position";
DROP TYPE "public"."Position_old";
COMMIT;
