/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Request` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price` on the `Request` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'NOT_SUBMITTED';

-- DropForeignKey
ALTER TABLE "RequestItem" DROP CONSTRAINT "RequestItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "RequestItem" DROP CONSTRAINT "RequestItem_requestId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Item_id_seq";

-- AlterTable
ALTER TABLE "Request" DROP CONSTRAINT "Request_pkey",
DROP COLUMN "price",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'NOT_SUBMITTED',
ADD CONSTRAINT "Request_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Request_id_seq";

-- AlterTable
ALTER TABLE "RequestItem" ALTER COLUMN "requestId" SET DATA TYPE TEXT,
ALTER COLUMN "itemId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestItem" ADD CONSTRAINT "RequestItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestItem" ADD CONSTRAINT "RequestItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
