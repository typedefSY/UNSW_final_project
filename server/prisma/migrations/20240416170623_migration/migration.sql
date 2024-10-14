-- CreateTable
CREATE TABLE `CourseBook` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `parentID` VARCHAR(191) NULL,
    `content` JSON NULL,
    `courseID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseBook` ADD CONSTRAINT `CourseBook_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseBook` ADD CONSTRAINT `CourseBook_parentID_fkey` FOREIGN KEY (`parentID`) REFERENCES `CourseBook`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
