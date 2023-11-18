/*
  Warnings:

  - Added the required column `duration` to the `ClockedTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClockedTime" ADD COLUMN     "duration" INTEGER NOT NULL;
