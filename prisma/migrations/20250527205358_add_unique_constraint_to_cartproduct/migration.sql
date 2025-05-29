/*
  Warnings:

  - A unique constraint covering the columns `[cart_id,product_id]` on the table `CartProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "CartProduct_cart_id_product_id_key" ON "CartProduct"("cart_id", "product_id");
