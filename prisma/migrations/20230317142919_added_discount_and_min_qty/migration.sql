-- AlterTable
ALTER TABLE "WholesaleProducts" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0.04,
ADD COLUMN     "minQty" INTEGER NOT NULL DEFAULT 10;
