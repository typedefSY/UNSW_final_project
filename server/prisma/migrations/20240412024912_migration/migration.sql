/*
  Warnings:

  - A unique constraint covering the columns `[postID,userID]` on the table `PostLikes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PostLikes_postID_userID_key` ON `PostLikes`(`postID`, `userID`);
