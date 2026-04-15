/*
  Warnings:

  - You are about to drop the `RequestItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('PENDING_APPROVAL', 'AWAITING_PURCHASE', 'PURCHASED', 'ON_CAMPUS', 'DENIED');

-- DropForeignKey
ALTER TABLE "RequestItem" DROP CONSTRAINT "RequestItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "RequestItem" DROP CONSTRAINT "RequestItem_requestId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "requestId" TEXT,
ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "physicalLocation" SET DATA TYPE TEXT,
ALTER COLUMN "placeOfPurchase" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "RequestItem";

-- CreateTable
CREATE TABLE "_approvedRequests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_approvedRequests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_approvedRequests_B_index" ON "_approvedRequests"("B");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_approvedRequests" ADD CONSTRAINT "_approvedRequests_A_fkey" FOREIGN KEY ("A") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_approvedRequests" ADD CONSTRAINT "_approvedRequests_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
