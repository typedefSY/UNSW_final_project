/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Submission` DROP COLUMN `fileUrl`,
    ADD COLUMN `assignmentContent` JSON NULL;
