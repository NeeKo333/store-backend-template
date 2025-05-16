/*
  Warnings:

  - The `revoked_at` column on the `RefreshToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `expires_at` on the `RefreshToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "expires_at",
ADD COLUMN     "expires_at" INTEGER NOT NULL,
DROP COLUMN "revoked_at",
ADD COLUMN     "revoked_at" INTEGER;
