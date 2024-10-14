/*
  Warnings:

  - You are about to drop the column `courseId` on the `Assessment` table. All the data in the column will be lost.
  - Added the required column `courseID` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Assessment` DROP FOREIGN KEY `Assessment_courseId_fkey`;

-- AlterTable
ALTER TABLE `Assessment` DROP COLUMN `courseId`,
    ADD COLUMN `courseID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
