-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 10,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 5;
