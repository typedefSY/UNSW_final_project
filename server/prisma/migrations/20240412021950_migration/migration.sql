-- CreateTable
CREATE TABLE `ThreadViews` (
    `threadID` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `viewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ThreadViews_threadID_userID_idx`(`threadID`, `userID`),
    PRIMARY KEY (`threadID`, `userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostLikes` (
    `postID` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,

    INDEX `PostLikes_postID_userID_idx`(`postID`, `userID`),
    PRIMARY KEY (`postID`, `userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
