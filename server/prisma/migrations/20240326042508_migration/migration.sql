/*
  Warnings:

  - You are about to drop the column `assignmentId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assessmentId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_assessmentId_fkey`;

-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_assignmentId_fkey`;

-- AlterTable
ALTER TABLE `Assessment` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL,
    MODIFY `dueDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Submission` DROP COLUMN `assignmentId`,
    DROP COLUMN `feedback`,
    DROP COLUMN `grade`,
    ADD COLUMN `answers` JSON NULL,
    ADD COLUMN `assessmentId` VARCHAR(191) NOT NULL,
    MODIFY `fileUrl` VARCHAR(191) NULL,
    MODIFY `submittedAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Assignment`;

-- CreateTable
CREATE TABLE `Question` (
    `id` VARCHAR(191) NOT NULL,
    `assessmentId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `options` JSON NULL,
    `points` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_assessmentId_fkey` FOREIGN KEY (`assessmentId`) REFERENCES `Assessment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_assessmentId_fkey` FOREIGN KEY (`assessmentId`) REFERENCES `Assessment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
