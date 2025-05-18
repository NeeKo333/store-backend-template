/*
  Warnings:

  - A unique constraint covering the columns `[user_id,token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_user_id_token_key" ON "RefreshToken"("user_id", "token");
