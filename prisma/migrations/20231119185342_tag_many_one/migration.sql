/*
  Warnings:

  - You are about to drop the `_ClockedTimeToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClockedTimeToTag" DROP CONSTRAINT "_ClockedTimeToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClockedTimeToTag" DROP CONSTRAINT "_ClockedTimeToTag_B_fkey";

-- AlterTable
ALTER TABLE "ClockedTime" ADD COLUMN     "tagId" TEXT,
ALTER COLUMN "end" DROP NOT NULL;

-- DropTable
DROP TABLE "_ClockedTimeToTag";

-- AddForeignKey
ALTER TABLE "ClockedTime" ADD CONSTRAINT "ClockedTime_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
