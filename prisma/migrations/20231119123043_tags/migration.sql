/*
  Warnings:

  - You are about to drop the column `groupId` on the `ClockedTime` table. All the data in the column will be lost.
  - You are about to drop the `ClockedTimeGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClockedTime" DROP CONSTRAINT "ClockedTime_groupId_fkey";

-- DropForeignKey
ALTER TABLE "ClockedTimeGroup" DROP CONSTRAINT "ClockedTimeGroup_userId_fkey";

-- AlterTable
ALTER TABLE "ClockedTime" DROP COLUMN "groupId",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ClockedTimeGroup";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClockedTimeToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClockedTimeToTag_AB_unique" ON "_ClockedTimeToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ClockedTimeToTag_B_index" ON "_ClockedTimeToTag"("B");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClockedTimeToTag" ADD CONSTRAINT "_ClockedTimeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "ClockedTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClockedTimeToTag" ADD CONSTRAINT "_ClockedTimeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
