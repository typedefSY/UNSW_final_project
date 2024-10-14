/*
  Warnings:

  - You are about to drop the column `userID` on the `EmailVerification` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - Added the required column `email` to the `EmailVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `EmailVerification_verification_key` ON `EmailVerification`;

-- AlterTable
ALTER TABLE `EmailVerification` DROP COLUMN `userID`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Token` ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `emailVerified`;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
