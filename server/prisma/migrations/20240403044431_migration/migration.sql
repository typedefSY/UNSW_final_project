-- CreateTable
CREATE TABLE `CourseInvitations` (
    `courseID` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `secret` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdByID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CourseInvitations_secret_key`(`secret`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseMembers` (
    `courseID` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'TEACHER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`courseID`, `userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseInvitations` ADD CONSTRAINT `CourseInvitations_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseInvitations` ADD CONSTRAINT `CourseInvitations_createdByID_fkey` FOREIGN KEY (`createdByID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseMembers` ADD CONSTRAINT `CourseMembers_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
