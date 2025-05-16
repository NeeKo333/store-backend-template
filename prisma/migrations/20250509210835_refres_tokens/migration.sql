/*
  Warnings:

  - Added the required column `revoked_at` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "revoked_at",
ADD COLUMN     "revoked_at" BOOLEAN NOT NULL;
