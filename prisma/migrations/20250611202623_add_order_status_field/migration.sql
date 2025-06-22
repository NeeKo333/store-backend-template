-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'access', 'canceled');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'pending';
