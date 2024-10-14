/*
  Warnings:

  - You are about to drop the column `instructorId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `_CourseStudents` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdByID` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Assessment` DROP FOREIGN KEY `Assessment_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_instructorId_fkey`;

-- DropForeignKey
ALTER TABLE `_CourseStudents` DROP FOREIGN KEY `_CourseStudents_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CourseStudents` DROP FOREIGN KEY `_CourseStudents_B_fkey`;

-- DropIndex
DROP INDEX `Course_code_key` ON `Course`;

-- AlterTable
ALTER TABLE `Course` DROP COLUMN `instructorId`,
    DROP COLUMN `title`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdByID` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageURL` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `code` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_CourseStudents`;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_createdByID_fkey` FOREIGN KEY (`createdByID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
