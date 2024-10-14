/*
  Warnings:

  - Added the required column `createdByID` to the `Forum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Forum` ADD COLUMN `createdByID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Forum` ADD CONSTRAINT `Forum_createdByID_fkey` FOREIGN KEY (`createdByID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
