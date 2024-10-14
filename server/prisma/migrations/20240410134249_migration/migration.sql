/*
  Warnings:

  - A unique constraint covering the columns `[courseID]` on the table `Forum` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Forum_courseID_key` ON `Forum`(`courseID`);
