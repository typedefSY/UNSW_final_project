-- CreateIndex
CREATE INDEX `CourseMembers_courseID_userID_idx` ON `CourseMembers`(`courseID`, `userID`);

-- AddForeignKey
ALTER TABLE `CourseMembers` ADD CONSTRAINT `CourseMembers_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
