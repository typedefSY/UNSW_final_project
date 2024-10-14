/*
  Warnings:

  - You are about to drop the column `assessmentId` on the `Question` table. All the data in the column will be lost.
  - Added the required column `assessmentID` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_assessmentId_fkey`;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `assessmentId`,
    ADD COLUMN `answer` VARCHAR(191) NULL,
    ADD COLUMN `assessmentID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_assessmentID_fkey` FOREIGN KEY (`assessmentID`) REFERENCES `Assessment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
