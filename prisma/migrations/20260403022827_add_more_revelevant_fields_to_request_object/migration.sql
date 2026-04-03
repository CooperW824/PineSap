/*
  Warnings:

  - You are about to drop the column `price` on the `Request` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'NOT_SUBMITTED';

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "price",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NOT_SUBMITTED';

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
