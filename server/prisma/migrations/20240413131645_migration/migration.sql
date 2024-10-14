/*
  Warnings:

  - You are about to drop the column `assessmentId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `assessmentID` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentID` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_assessmentId_fkey`;

-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_studentId_fkey`;

-- AlterTable
ALTER TABLE `Submission` DROP COLUMN `assessmentId`,
    DROP COLUMN `studentId`,
    ADD COLUMN `assessmentID` VARCHAR(191) NOT NULL,
    ADD COLUMN `studentID` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_assessmentID_fkey` FOREIGN KEY (`assessmentID`) REFERENCES `Assessment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
