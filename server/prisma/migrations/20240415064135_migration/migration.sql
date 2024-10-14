/*
  Warnings:

  - You are about to drop the column `isAnnoucement` on the `Thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Thread` DROP COLUMN `isAnnoucement`,
    ADD COLUMN `isAnnouncement` BOOLEAN NOT NULL DEFAULT false;
