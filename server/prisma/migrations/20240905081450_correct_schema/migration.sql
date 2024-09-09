/*
  Warnings:

  - Made the column `spaceId` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Space` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_userId_fkey";

-- DropIndex
DROP INDEX "Review_email_key";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "spaceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Space" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;
